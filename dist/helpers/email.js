"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, text) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer_1.default.createTransport({
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
            }
            else {
                resolve(true);
            }
        });
    });
};
exports.default = { sendEmail };
//# sourceMappingURL=email.js.map