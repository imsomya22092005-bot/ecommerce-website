const nodemailer = require('nodemailer');

const emailUser = String(process.env.EMAIL_USER || '').trim();
const emailPassword = String(
    process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || ''
).replace(/\s/g, '');

const emailHost = String(process.env.EMAIL_HOST || 'smtp.gmail.com').trim();
const emailPort = Number(process.env.EMAIL_PORT || 465);
const emailSecure =
    String(process.env.EMAIL_SECURE || (emailPort === 465))
        .toLowerCase() === 'true';

const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailSecure,
    auth: {
        user: emailUser,
        pass: emailPassword
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000
});

if (emailUser && emailPassword) {
    transporter.verify()
        .then(() => {
            console.log('Email transporter verified successfully.');
        })
        .catch((error) => {
            console.error(
                'Email transporter verification failed:',
                error.message
            );
        });
} else {
    console.error(
        'Email transporter is not configured. Set EMAIL_USER and EMAIL_PASSWORD on Render.'
    );
}

module.exports = transporter;
