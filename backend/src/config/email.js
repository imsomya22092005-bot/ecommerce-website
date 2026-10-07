const sendEmail = async ({ to, subject, html }) => {
    try {
        const response = await fetch(
            'https://api.brevo.com/v3/smtp/email',
            {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: 'Fashion Store',
                        email: process.env.BREVO_SENDER_EMAIL
                    },
                    to: [
                        {
                            email: to
                        }
                    ],
                    subject,
                    htmlContent: html
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Brevo email request failed'
            );
        }

        console.log(`Email sent successfully to ${to}`);

        return true;

    } catch (error) {
        console.error('Email sending failed:', error.message);
        return false;
    }
};

module.exports = sendEmail;