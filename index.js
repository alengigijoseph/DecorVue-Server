//const { createServer } = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const uploaddRoutes = require('./routes/upload');
//const uploadRoutes = require('./routes/upload_cloud')
require('dotenv').config();


const app = express();
const port = 3000;


app.use(bodyParser.json({ limit: '50mb' }));


app.use('/auth', authRoutes);
app.use('/items',itemRoutes)
//app.use('/upload', uploadRoutes);
app.use('/uploadd',uploaddRoutes)
app.use('/pictures', express.static(__dirname + "/pictures"));


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    console.log(process.env.JWT_SECRET)
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

  
//const server = createServer(app);


//module.exports = server;
