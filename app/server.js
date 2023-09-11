const express = require('express');
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./database/db'); // Adjust the path as needed
const registerPatientRoute = require('./routes/registerPatient'); 
const registerPharmacyRoute = require('./routes/registerPharmacy'); 
const doctorOTPRoute = require('./routes/doctorOTP'); 
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(express.json()) ;
app.use(express.urlencoded()) ;

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method}:${req.url}`);
  next();
})


connectToDatabase();

app.use('/api/registerPharmacy', registerPharmacyRoute);
app.use('/api/registerPatient', registerPatientRoute);
app.use('/api/doctorOTP', doctorOTPRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
