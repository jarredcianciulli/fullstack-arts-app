const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendConfirmationEmail = async (toEmail, registrationData) => {
  const { firstName, serviceType, lessonPackage } = registrationData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Registration Confirmation - Soundworks Music Company',
    html: `
      <h1>Thank you for registering with Soundworks Music Company!</h1>
      <p>Dear ${firstName},</p>
      <p>We have received your registration for ${serviceType} lessons.</p>
      <p>Package selected: ${lessonPackage.name}</p>
      <p>We will contact you shortly to confirm your schedule and provide further details.</p>
      <br>
      <p>Best regards,</p>
      <p>The Soundworks Music Company Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmail
};
