const sendEmail = require('../config/email');

const sendRegistrationEmail = async (user) => {
    return sendEmail({
        to: user.email,
        subject: 'Welcome to Fashion Store',
        html: `
            <h2>Welcome, ${user.username}!</h2>
            <p>Your Fashion Store account has been created successfully.</p>
            <p>Thank you for joining us.</p>
        `
    });
};

const sendLoginEmail = async (user) => {
    return sendEmail({
        to: user.email,
        subject: 'New Login to Fashion Store',
        html: `
            <h2>Hello ${user.username}!</h2>
            <p>Your Fashion Store account was just used to log in.</p>
            <p>If this was not you, please secure your account.</p>
        `
    });
};

const sendOrderConfirmationEmail = async (user, order) => {
    return sendEmail({
        to: user.email,
        subject: `Order Confirmed - ${order._id}`,
        html: `
            <h2>Order Confirmed!</h2>
            <p>Thank you for your order.</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p>Your order has been successfully placed.</p>
        `
    });
};

const sendOrderStatusEmail = async (user, order, status) => {
    return sendEmail({
        to: user.email,
        subject: `Order Status Updated - ${order._id}`,
        html: `
            <h2>Order Status Updated</h2>
            <p>Your order status has been updated.</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Status:</strong> ${status}</p>
        `
    });
};

module.exports = {
    sendRegistrationEmail,
    sendLoginEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail
};