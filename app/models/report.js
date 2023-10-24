const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  MedicineName: String,
  BrandName: String,
  Quantity: String,
  TakingMethod: {
    beforeMeal: Boolean,
    afterMeal: Boolean,
    morning: Boolean,
    afternoon: Boolean,
    evening: Boolean,
  },
  Instructions: String,
});

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,   
},

  prescriptions: [prescriptionSchema],
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
        