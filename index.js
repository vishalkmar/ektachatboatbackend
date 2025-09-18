const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const exrouter = require('./routers/exrouter');
const app = express();

// Parse JSON
app.use(bodyparser.json());

// CORS configuration
app.use(cors({
    origin: 'https://ektaboat.netlify.app', // only allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // if you need cookies/auth
}));

// Routes
app.use('/api', exrouter);

const port = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("Error while connecting DB:", err));

// Start server
app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});
