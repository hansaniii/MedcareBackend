const {Router} = require('express');
let Patient = require("../models/patient");
const nodemailer = require('nodemailer');
const secretKey = 'medcare-secret'; 
const jwt = require("jsonwebtoken");
const router = Router();


// Create a transporter object to send the email
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use the email service you want to use
  auth: {
    user: 'medcaremails@gmail.com', // Replace with your email address
    pass: 'gzlw huby lbew cxgc', // Replace with your email password
  },
});

//generate 4 bit otp
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

//reg doctor
router.post('/patientreg', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiration = new Date(Date.now() + 5* 60 * 1000); // OTP expires in 5 minutes

  try {
    const user = await Patient({email,otp, otpExpiration });

    const existingUser = await Patient.findOne({ $or: [{ email }] });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  user.otp=otp;
  user.otpExpiration=otpExpiration;
  await user.save();

  await transporter.sendMail({
    from:'medcaremails@gmail.com', // Replace with your email address

    to: email,
    subject: 'OTP Verification',
    text: `Enter ${otp} in the application to verify your email address and complete the signup process. This code expires in 10 minutes`,
  });

  res.status(200).json({ message: 'To Complete your Registration Check your email or phone for OTP.' });

} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Error registering user.' });
}
});

// Verify OTP
router.post('/Paverify', async (req, res) => {
  const { name, email, phone, nic, password, otp, role} = req.body; 

  try {
    // Find the user in the database
    const user = await Patient.findOne( {email});
   
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.otp === otp && user.otpExpiration > Date.now()) {
      //save information
      await Patient.deleteMany({email});
      const user = new Patient({name, email, phone, nic, password, otp, role})

      await user.save(); 
      // OTP is valid
      return res.status(200).json({ message: 'OTP verified successfully. You can now log into your account.' });
      
    } 
   
    else {
      // Invalid OTP
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying OTP.' });
  }
});

//Resend verification code
router.post("/paresendmail",async(req,res) => {
  try{
    const {email } = req.body;
 
    
   
    if ( !email ){
      throw Error("Empty user details are not allowed");
    }else {
      
      await Patient.deleteMany({email});
      const otp = generateOTP();
      const otpExpiration = new Date(Date.now() + 5* 60 * 1000); // OTP expires in 5 minutes
      const user = await Patient({email,otp, otpExpiration });
      await user.save();
      await transporter.sendMail({
        from:'medcaremails@gmail.com', // Replace with your email address
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

//......................................................................................

// Patient login
router.route("/Palogin").post(async (req, res)=>{
  const { email, password } = req.body;

  try {
    // Find the doctor user by email
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    if (password !== patient.password) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate a JWT token for the doctor
    const token = jwt.sign({ userId: patient._id, role: 'patient' }, secretKey // Token expires in 1 hour (adjust as needed)
    );

    // Log a success message
  return res.status(200).json({message:'Patient login successful', token});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;

