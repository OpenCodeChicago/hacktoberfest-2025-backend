import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
      console.log("Sending email to:", to);
     
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
        console.log("Email sent to:", to);
    } catch (err) {
        console.error("Email sending error:", err);
        throw err;
    }
};
