const transporter = require('../config/email');

const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"Fashion Store" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log(`Email sent successfully to ${to}`);

        return true;
    } catch (error) {
        console.error('Email sending failed:', error.message);

        return false;
    }
};

const sendRegistrationEmail = async (user) => {
    return sendEmail({
        to: user.email,
        subject: 'Welcome to Fashion Store',
        html: `
            <h2>Welcome, ${user.username}!</h2>

            <p>Your Fashion Store account has been created successfully.</p>

            <p>You can now browse products, save items to your wishlist,
            manage your cart and place orders.</p>

            <p>Happy shopping!</p>

            <p>— Fashion Store Team</p>
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

            <p>— Fashion Store Team</p>
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

            <p>— Fashion Store Team</p>
        `
    });
};

module.exports = {
    sendRegistrationEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail
};