import { transporter } from '../config/mailer.js';

export const sendEmail = async ({ to, subject, html, message }) => {
  try {
    const mailOptions = {
      from: `"Nexus Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: html || `<p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    // Don't throw error to prevent crashing the server
    return false;
  }
};
