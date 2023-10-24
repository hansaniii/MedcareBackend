const mongoose = require('mongoose');
//const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

//var passportLocalMongoose = require('passport-local-mongoose');


const doctorSchema = new Schema({

    fname : {
        type: String,
},
    email : {
        type: String,
        required: true,
        unique:true
    },
    conno : {
        type: Number,
    },

    slmc : {
    type: String,
   
},
    password: {
        type: String,
       
},
    otp: {
        type: String,
        required: true,
},
      otpExpiration: {
        type: Date,
        
      },
      role: {
        type: String,
        default:"doctor"
}
});



const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;