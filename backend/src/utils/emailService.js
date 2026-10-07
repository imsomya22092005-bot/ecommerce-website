const sendEmail = require('../config/email');

const sendRegistrationEmail = async (user) => {
    return sendEmail({
        to: user.email,
        subject: 'Welcome to Fashion Store',
        html: `
            <h2>Welcome, ${user.username}!</h2>

            <p>Your Fashion Store account has been created successfully.</p>

            <p>
                You can now browse products, save items to your wishlist,
                manage your cart and place orders.
            </p>

            <p>Happy shopping!</p>

            <p>— Fashion Store Team</p>
        `
    });
};

const sendLoginEmail = async (user) => {
    return sendEmail({
        to: user.email,
        subject: 'New Login to Your Fashion Store Account',
        html: `
            <h2>New Login Detected</h2>

            <p>Hi ${user.username},</p>

            <p>
                Your Fashion Store account was just used to log in.
            </p>

            <p>
                If this was you, you can safely ignore this email.
            </p>

            <p>
                If you did not perform this login, please secure your account.
            </p>

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

            <p>
                We'll keep you updated when your order status changes.
            </p>

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

            <p>
                <strong>Order ID:</strong> ${order._id}
            </p>

            <p>
                <strong>Order Total:</strong> ₹${order.totalAmount}
            </p>

            <p>
                Thank you for shopping with us.
            </p>

            <p>— Fashion Store Team</p>
        `
    });
};

module.exports = {
    sendRegistrationEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
    sendLoginEmail
};