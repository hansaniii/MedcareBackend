const router = require("express").Router();
const User = require('../database/schemas/doctor');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');


// Create a transporter object to send the email
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use the email service you want to use
  auth: {
    user: 'medcaremails@gmail.com', // Replace with your email address
    pass: 'ppjv mtjw rbzm rrde', // Replace with your email password
  },
});

//generate 4 bit otp
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

//reg doctor
router.post('/docreg', async (req, res) => {
  const {fname, email, conno, slmc, password } = req.body;
  const otp = generateOTP();
  const otpExpiration = new Date(Date.now() + 1* 60 * 1000); // OTP expires in 5 minutes

  try {
// Save user to the database
    const user = new Doctor({fname, email, conno, slmc ,password, otp, otpExpiration });
   
    
  
  if (!fname || !email || !conno || !slmc ||!password) {
      return res.status(400).json({ message: 'Please provide all information' });
    }

// Check if user already exists
  const existingUser = await Doctor.findOne({ $or: [{ email }, {fname}] });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  

// Save the user to the database
  await user.save();

  await transporter.sendMail({
    from:'medcaremails@gmail.com', // Replace with your email address

    to: email,
    subject: 'OTP Verification',
    text: `Enter ${otp} in the application to verify your email address and complete the signup process. This code expires in 10 minutes`,
  });

  res.status(200).json({ message: 'User registered successfully. Check your email or phone for OTP.' });
} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Error registering user.' });
}
});

// Verify OTP
router.post('/verify', async (req, res) => {
  const  {fname, email, otp }  = req.body;
  
  try {
    // Find the user in the database
    const user = await Doctor.findOne( {fname, email});

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.otp === otp && user.otpExpiration > Date.now()) {
      // OTP is valid
      return res.status(200).json({ message: 'OTP verified successfully. You can now complete the registration.' });
    } else {
      // Invalid OTP
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
});

//Resend verification code
router.post("/resendmail",async(req,res) => {
  try{
    const {fname, email, conno, slmc, password } = req.body;

    
   
    if (!fname || !email || !conno || !slmc ||!password){
      throw Error("Empty user details are not allowed");
    }else {
      
      await Doctor.deleteMany({email});
      const otp = generateOTP();
      const otpExpiration = new Date(Date.now() + 1* 60 * 1000); // OTP expires in 5 minutes
      const user = new Doctor({fname, email, conno, slmc ,password, otp, otpExpiration });
      await user.save();
      await transporter.sendMail({
        from:'medcaremails@gmail.com', // Sender email address
        to: email,
        subject: 'OTP Verification',
        text: `Enter ${otp} in the application to verify your email address and complete the signup process. This code expires in 10 minutes`,
      });
      return res.status(200).json({ message: 'Resent the OTP check your email' });
      
    }
   }catch(error) {
      res.json({
        status: "Failed",
        message:error.message,
      })
   }
  
});

// Doctor login
router.route("/doclogin").post(async (req, res)=>{
  const { email, password } = req.body;

  try {
    // Find the doctor user by email
    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    if (password !== doctor.password) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate a JWT token for the doctor
    const token = jwt.sign({ userId: doctor._id, userType: 'doctor' }, secretKey, {
    expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
    });

    // Log a success message
  return res.status(200).json({message:'Doctor login successful', token});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;
