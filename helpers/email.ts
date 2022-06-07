import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, text: string) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            secure: false,
        });

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to,
            subject,
            text,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};

export default { sendEmail };
