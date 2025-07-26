
// send-reset-token.js (located in the /functions folder)
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.handler = async (event, context) => {
  const { email } = JSON.parse(event.body);

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: 'Invalid email address.' }),
    };
  }

  // Create a transporter for Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const tokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

  // Send email with reset token
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Token',
    text: `Your password reset token is: ${resetToken}. This token will expire in 1 hour.`,
  };

  try {
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Reset token sent to your email.' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Error sending email.' }),
    };
  }
};
