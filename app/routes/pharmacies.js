const {Router} = require('express');
let Pharmacy = require("../models/pharmacy");
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

//register pharmacy
router.post('/pharmacyreg', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiration = new Date(Date.now() + 5* 60 * 1000); // OTP expires in 5 minutes

  try {
    const user = await Pharmacy({email,otp, otpExpiration });

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
router.post('/Pharmacyverify', async (req, res) => {
  const { name, email, phone, registrationNo, locatedTown, password, role} = req.body; 

  try {
    // Find the user in the database
    const user = await Pharmacy.findOne( {email});
   
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.otp === otp && user.otpExpiration > Date.now()) {
      //save information
      await Pharmacy.deleteMany({email});
      const user = new Pharmacy({name, email, phone, registrationNo, locatedTown, password, role})

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
router.post("/pharmacyresendmail",async(req,res) => {
  try{
    const {email } = req.body;
 
    
   
    if ( !email ){
      throw Error("Empty user details are not allowed");
    }else {
      
      await Pharmacy.deleteMany({email});
      const otp = generateOTP();
      const otpExpiration = new Date(Date.now() + 5* 60 * 1000); // OTP expires in 5 minutes
      const user = await Pharmacy({email,otp, otpExpiration });
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

// Pharmacy login
router.route("/Pharmacylogin").post(async (req, res)=>{
  const { email, password } = req.body;

  try {
    // Find the doctor user by email
    const pharmacy = await Pharmacy.findOne({ email });

    if (!pharmacy) {
      return res.status(404).json({ message: 'pharmacy not found.' });
    }

    if (password !== pharmacy.password) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate a JWT token for the doctor
    const token = jwt.sign({ userId: pharmacy._id, role: 'pharmacy' }, secretKey // Token expires in 1 hour (adjust as needed)
    );

    // Log a success message
  return res.status(200).json({message:'pharmacy login successful', token});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;

