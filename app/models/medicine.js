const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mediSchema = new Schema({

    drug_name : {
        type: String,
        required: true
    },
    brand : {
        type: String,
        required: true
    },
    mfg_date : {
        type: String,
        required: true
    },
    exp_date : {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    batchno: {
        type:String
    },
    pharmacy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'registrationNo'
    }
})

const Medicine = mongoose.model("Medicine", mediSchema);

module.exports = Medicine;