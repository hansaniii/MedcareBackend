const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        
    },
    email: { 
        type: String, 
        required: true,
       
    },
    phone: {
        type:Number,
       
    },
    nic: {
        type: mongoose.SchemaTypes.String,
       
    },
    password: {
        type: mongoose.SchemaTypes.String,
       
    },
    otp: {
        type: String,
       
    },
      otpExpiration: {
        type: Date,
        
      },
    role: {
        type: String,
        default:"patient"
}
},
    { timestamps: true }
  );



  const Patient = mongoose.model('patients', userSchema);
  module.exports = Patient; 