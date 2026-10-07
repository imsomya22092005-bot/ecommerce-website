const sendEmail = require('../config/email');

// const sendEmail = async ({ to, subject, html }) => {
//     const emailUser = String(process.env.EMAIL_USER || '').trim();
//     const emailPassword = String(
//         process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || ''
//     ).replace(/\s/g, '');

//     if (!emailUser || !emailPassword) {
//         console.error(
//             'Email sending skipped: EMAIL_USER or EMAIL_PASSWORD is missing on the deployed backend.'
//         );
//         return false;
//     }

//     try {
//         await transporter.sendMail({
//             from: `"ShopSphere" <${emailUser}>`,
//             replyTo: emailUser,
//             to,
//             subject,
//             html
//         });

//         console.log(`Email sent successfully to ${to}`);

//         return true;
//     } catch (error) {
//         console.error('Email sending failed:', error.message);

//         return false;
//     }
// };

const sendRegistrationEmail = async (user) => {
    return sendEmail({
        to: user.email,
        subject: 'Welcome to ShopSphere',
        html: `
            <h2>Welcome, ${user.username}!</h2>

            <p>Your ShopSphere account has been created successfully.</p>

            <p>You can now browse products, save items to your wishlist,
            manage your cart and place orders.</p>

            <p>Happy shopping!</p>

            <p>— ShopSphere Team</p>
        `
    });
};

const sendLoginEmail = async (user) => {
    return sendEmail({
        to: user.email,
        subject: 'New Login to Your ShopSphere Account',
        html: `
            <h2>Welcome back, ${user.username}! 👋</h2>
            <p>We noticed a successful login to your ShopSphere account.</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p>If this was you, no action is needed.</p>
            <p>If you did not log in, please secure your account.</p>
            <p>— ShopSphere Team</p>
        `
    });
};

const sendOrderConfirmationEmail = async (user, order) => {
    const items = order.items.map(item => `
        <li>
            ${item.product?.name || 'Product'}
            - ${item.color} / ${item.size}
            × ${item.quantity}
            - ₹${item.price}
        </li>
    `).join('');

    return sendEmail({
        to: user.email,
        subject: `Order Confirmed - ${order._id}`,
        html: `
            <h2>Order Confirmed 🎉</h2>

            <p>Hi ${user.username},</p>

            <p>Your order has been placed successfully.</p>

            <h3>Order ID</h3>
            <p>${order._id}</p>

            <h3>Items</h3>
            <ul>
                ${items}
            </ul>

            <h3>Total: ₹${order.totalAmount}</h3>

            <p>We'll keep you updated when your order status changes.</p>

            <p>— ShopSphere Team</p>
        `
    });
};

const sendOrderStatusEmail = async (user, order, status) => {
    const messages = {
        shipped: {
            subject: 'Your Order Has Been Shipped 🚚',
            message: 'Great news! Your order is on its way.'
        },

        delivered: {
            subject: 'Your Order Has Been Delivered 🎉',
            message: 'Your order has been delivered successfully.'
        },

        cancelled: {
            subject: 'Your Order Has Been Cancelled',
            message: 'Your order has been cancelled successfully.'
        }
    };

    const emailInfo = messages[status];

    if (!emailInfo) {
        return false;
    }

    return sendEmail({
        to: user.email,
        subject: emailInfo.subject,
        html: `
            <h2>${emailInfo.subject}</h2>

            <p>Hi ${user.username},</p>

            <p>${emailInfo.message}</p>

            <p><strong>Order ID:</strong> ${order._id}</p>

            <p><strong>Order Total:</strong> ₹${order.totalAmount}</p>

            <p>Thank you for shopping with us.</p>

            <p>— ShopSphere Team</p>
        `
    });
};


const sendNewProductEmail = async (subscriber, product) => {
    const productUrl = process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/product/${product._id}`
        : null;

    return sendEmail({
        to: subscriber.email,
        subject: `New on ShopSphere: ${product.name}`,
        html: `
            <h2>A new ShopSphere favourite just arrived ✨</h2>

            <p>We have added a new product to the collection.</p>

            <h3>${product.name}</h3>

            <p><strong>Category:</strong> ${product.category || 'ShopSphere Collection'}</p>
            <p><strong>Price:</strong> ₹${product.discountPrice || product.price}</p>

            ${productUrl
                ? `<p><a href="${productUrl}">View this product on ShopSphere →</a></p>`
                : ''}

            <p>Thank you for staying in the loop.</p>

            <p>— ShopSphere Team</p>
        `
    });
};

const sendNewProductEmails = async (subscribers, product) => {
    if (!Array.isArray(subscribers) || subscribers.length === 0) {
        return;
    }

    await Promise.allSettled(
        subscribers.map((subscriber) =>
            sendNewProductEmail(subscriber, product)
        )
    );
};

module.exports = {
    sendRegistrationEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
    sendLoginEmail,
    sendNewProductEmail,
    sendNewProductEmails
};