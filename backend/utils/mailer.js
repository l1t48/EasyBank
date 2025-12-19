// | Function Name | Description |
// |----------------|-------------|
// | sendMail       | Sends an email using Nodemailer with Gmail service |


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, subject, html) {
  const info = await transporter.sendMail({
    from: `"Simple BankingSystem Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  console.log('Email sent:', info.messageId);
  return info;
}

module.exports = sendMail;
