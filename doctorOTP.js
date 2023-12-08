const router = require("express").Router();
const nodemailer = require('nodemailer');
const Patient = require("../models/patient");
require('dotenv').config;



// Generate a random 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Function to send OTP via email
async function sendOTPByEmail(email, Otp) {
  try {
    // Create a nodemailer transporter with your email service provider's configuration
    const transporter = nodemailer.createTransport({
      service: 'Gmail', //  email service provider
      auth: {
        user: 'medcaremails@gmail.com', // Sender email address
        pass: 'gzlw huby lbew cxgc', // email app password from Sender email
      },
    });

    // Email content
    const mailOptions = {
      from: 'MedCare <process.env.MYEMAIL>',
      to: email,
      subject: 'Your OTP Code',
      text: `Please, Enter the following verification OTP code : ${Otp}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/*
//generate an age
function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  // Check if the birthday has occurred this year
  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
*/


// Handle POST requests to '/api/doctorOTP'
router.post('/sentOtpPatient', async (req, res) => {
  try {
    // Extract the email from the request body
    const {email}  = req.body;

    // Find the user by email
    const user = await Patient.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found for the provided email' });
    }
    
    // Remove the current OTP from the user document
    user.Otp = undefined;
    user.otpExpiration = undefined;
    await user.save();


    // Generate a 4-digit OTP
    const newOtp = generateOTP();
    
     // Store the new OTP and its expiration timestamp
     user.Otp = newOtp;
    // Store the OTP along with an expiration timestamp
    const otpExpiration = new Date();
    user.otpExpiration = otpExpiration.setMinutes(otpExpiration.getMinutes() + 2);  // Expires in 02 minutes
    await user.save();
    
    // Send the OTP via email (or any other method)
    await sendOTPByEmail(email, newOtp);

    // Respond with a success status and message
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Patient verify Doctor req

router.post('/verifyDocreq', async (req, res) => {
  try {

    const {email, Otp} = req.body;
    const user = await Patient.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Prescriptions not found' });
    }
     // Check if the OTP matches
     if (user.Otp === Otp && user.otpExpiration > Date.now()) {
      const name = user.name;
    
    
    const uppername = name.toUpperCase();
      
      
      // OTP is valid, return the user's name
      return res.status(200).json({uppername});
    }

    else {
      // Invalid OTP
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving prescriptions' });
  }
  
  });
module.exports = router;