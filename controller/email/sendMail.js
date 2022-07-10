import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, //true for 465 port, false for other port
  auth: {
    user: process.env.EMAIL_USER,//admin email
    pass: process.env.EMAIL_PASS,//admin password
  },
});

export default transporter;
