const nodemailer = require('nodemailer');

const emailUser = String(process.env.EMAIL_USER || '').trim();

const emailPassword = String(
  process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS || ''
).replace(/\s/g, '');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPassword
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
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