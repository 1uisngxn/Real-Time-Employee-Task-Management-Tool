import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Gmail của anh
    pass: process.env.SMTP_PASS  // App Password, KHÔNG dùng mật khẩu thật
  }
});

export const sendMail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Employee Management" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
