const router = require("express").Router();
const multer = require('multer');
const { MongoClient, GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const mongoose = require('mongoose');
const PDF = require('../models/pdfs'); // Adjust the path based on your project structure



// Set up MongoDB connection
const mongoURI = process.env.MONGODB_URL;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    const database = client.db('test');
    const bucket = new GridFSBucket(database);

    // Use Multer to handle file uploads
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    // Define a route for uploading PDF files
   router.post('/upload', upload.single('pdf'), async (req, res) => {
      try {
        const{originalname,buffer } = req.file;
        const email = req.body.email;
        // Create a readable stream from the buffer
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        // Create a new PDF document
        const pdf = new PDF({
          email:email,
          name: originalname,
        });

        // Save the PDF to MongoDB using Mongoose
        await pdf.save();

        // Create a write stream to store the PDF in GridFS
        const uploadStream = bucket.openUploadStream(pdf._id);
        readableStream.pipe(uploadStream);

        uploadStream.on('error', (error) => {
          console.error(error);
          res.status(500).send('Internal Server Error');
        });

        uploadStream.on('finish', () => {
          res.status(200).send(PDF uploaded with ID: ${pdf._id});
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
