const {Router} = require('express');
const nodemailer = require('nodemailer');
const User = require('../database/schemas/patientUserModel');
const router = Router();
require('dotenv').config;



// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via email
async function sendOTPByEmail(email, otp) {
  try {
    // Create a nodemailer transporter with your email service provider's configuration
    const transporter = nodemailer.createTransport({
      service: 'Gmail', //  email service provider
      auth: {
        user: 'medcaremails@gmail.com', // Sender email address
        pass: 'ksoklxcsipegncax', // email app password from Sender email
      },
    });

    // Email content
    const mailOptions = {
      from: 'MedCare <process.env.MYEMAIL>',
      to: email,
      subject: 'Your OTP Code',
      text: `Please, Enter the following verification OTP code : ${otp}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}


// Handle POST requests to '/api/doctorOTP'
router.post('/', async (req, res) => {
  try {
    // Extract the email from the request body
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found for the provided email' });
    }

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Store the OTP along with an expiration timestamp
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10); // Expires in 10 minutes

    
    // Send the OTP via email (or any other method)
    await sendOTPByEmail(email, otp);

    // Respond with a success status and message
    return res.status(201).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
