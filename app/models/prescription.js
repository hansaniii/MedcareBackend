const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  email: { 
    type: String, 
    required: true,
  },
formDataArray:[{
  
FormData: [
    { 
      Date: { type:Date,
              required:true},
      MedicineName: {type:String},
      BrandName: {type:String},
      Quantity: {type:String},
      TakingMethod: {
        beforeMeal: {type:Boolean},
        afterMeal: {type:Boolean},
        morning: {type:Boolean},
        afternoon: {type:Boolean},
        evening: {type:Boolean},
      },
      Instructions: {type:String}
    },
],
}]
});

const Prescription = mongoose.model('prescription', prescriptionSchema);

module.exports = Prescription;
