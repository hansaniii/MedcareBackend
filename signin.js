const router = require("express").Router();
let Doctor = require("../models/doctor");
let Patient = require("../models/patient");
let Pharmacy = require ("../models/pharmacy");
const jwt = require("jsonwebtoken");
const {protect} = require("../middleware/authenticate");
const dotenv = require("dotenv");
dotenv.config();




router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {

      let user;
      
  
      // Try to find the user in the doctor collection
      user = await Doctor.findOne({ email });
      if (user) {
         role = user.role;
       
      }
  
      // If not found in doctor collection, try patient collection
      if (!user) {
        user = await Patient.findOne({ email });
        if (user) {
          role = user.role;
          
        }
      }
  
      // If not found in patient collection, try pharmacy collection
      if (!user) {
        user = await Pharmacy.findOne({ email });
        if (user) {
           role = user.role;
        }
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid password." });
      }
  
      // Generate a JWT token for the user 
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_KEY 
        );
      /*
      const object = JSON.stringify({
        token:token,
        role
      })
      */
      const object = {
        token:token,
        role: role,
      };
      
      // Log a success message
      return res.status(200).json(object);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  
  module.exports=router;