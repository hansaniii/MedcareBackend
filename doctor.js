const mongoose = require('mongoose');
//const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

//var passportLocalMongoose = require('passport-local-mongoose');


const doctorSchema = new Schema({

    fname : {
        type: String,
        required: true,
        
    },
    email : {
        type: String,
        required: true,
        
    },
    conno : {
        type: Number,
        required: true
    },
    slmc : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
      },
      otpExpiration: {
        type: Date,
        required: true,
      },
});



const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;