const express = require('express');
const router = express.Router();
let Prescription = require("../models/prescription");


 
//save prescription to the database
router.post('/savePrescriptions', async (req, res) => {
  try {
    // Extract data from the request body
    const { email, formDataArray } = req.body.dataarray;
    
    // Create a new Prescription document and save it to the database
    const newPrescription = new Prescription({
      email,
      formDataArray,
    });

    await newPrescription.save();

    res.status(200).json({ message: 'Prescriptions saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while saving prescriptions' });
  }
});

//Get Prescription from database

// Route to retrieve prescription details for a specific email
router.get('/getPrescriptions/:email', async (req, res) => {
  try {
    // Extract email from the URL parameter
    const email = req.params.email;
    const prescriptions = await Prescription.find({ email });

    if (!prescriptions) {
      return res.status(404).json({ error: 'Prescriptions not found' });
    }

    // Map the retrieved data to match the desired format
    const prescriptionData = prescriptions.map((prescription) => {
      return {
        formDataArray: prescription.formDataArray.map((data) => ({
          FormData: data.FormData,
        })),
      };
    });

    // Send the prescription data as a nested array in the response
    res.status(200).json({ prescriptions: prescriptionData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving prescriptions' });
  }
});

module.exports = router;
