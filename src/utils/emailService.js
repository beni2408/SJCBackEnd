import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, name, memberID) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎉 Welcome to St. John's Church App!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 20px; border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">🙏 Welcome to Our SJC Family!</h1>
          <h2 style="color: #dc2626; margin-bottom: 15px;">Hello ${name}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">We're delighted to have you join our community at St. John's Church Madathuvilai.</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="color: #333; margin: 0;">✅ Your account has been created successfully</p>
            <p style="color: #dc2626; margin: 10px 0; font-weight: bold; font-size: 18px;">🆔 Your Member ID: ${memberID}</p>
            <p style="color: #333; margin: 10px 0 0 0;">📧 You can now access all church services and updates</p>
          </div>
          <p style="color: #666; font-size: 14px;">May God bless you abundantly!</p>
          <hr style="border: none; height: 1px; background: #fee2e2; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">St. John's Church Madathuvilai</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendLoginNotification = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔐 Secure Login - St. John's Church App",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 20px; border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">🙏 Welcome Back!</h1>
          <h2 style="color: #dc2626; margin-bottom: 15px;">Hello ${name}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">You have successfully logged into your St. John's Church account.</p>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <p style="color: #333; margin: 0; font-weight: bold;">✅ Login Successful</p>
            <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">Time: ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #666; font-size: 14px;">If this wasn't you, please contact us immediately.</p>
          <p style="color: #666; font-size: 14px;">God bless your day!</p>
          <hr style="border: none; height: 1px; background: #fee2e2; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">St. John's Church Madathuvilai</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};
