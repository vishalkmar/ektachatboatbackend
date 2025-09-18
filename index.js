
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const exrouter = require('./routers/exrouter')
const app = express();
app.use(bodyparser.json());
app.use(cors());
 
const port = process.env.PORT || 8000

app.use('/api',exrouter);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
     console.log('database is connected sucessfully');
})
.catch(()=>{
     console.log('error while connecting db');
})

app.listen(port,()=>{
      console.log(`app is running on port : ${port}`);
})


