const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 
const Item = require('../models/item');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const itemId = uuidv4(); // Generate a unique itemId for this group of images
    req.itemId = itemId; // Store the common item ID for all images
    const folderPath = path.join('pictures', itemId);
    
    // Only create the folder if it doesn't already exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true }); // Create the folder if not exists
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original filename temporarily
  }
});

const upload = multer({ storage });

router.post('/createtwo', upload.array('images', 10), async (req, res) => {
  try {
    const itemname = req.body.itemname;
    const itemdesc = req.body.itemdesc;
    const price = req.body.price;
    const offerprice = req.body.offerprice;
    const itemcat = req.body.itemcat;
    const commonItemId = req.itemId; // Use the generated itemId as the common identifier

    const imagePaths = req.files.map((file, index) => {
      const extension = path.extname(file.originalname);
      const newFilename = `image${index}${extension}`; // Create a sequential filename
      const newPath = path.join('pictures', commonItemId, newFilename);
      
      fs.renameSync(file.path, newPath); // Rename and move the file
      
      return newPath;
    });

    const sanitizedImagePaths = imagePaths.map(path => path.replace(/\//g, '\\'));
    // Create an item document with a unique _id value and associate it with the itemId
    const item = new Item({
      itemId: commonItemId, // Store the generated itemId
      itemName: itemname,
      about: itemdesc,
      category: itemcat,
      images: sanitizedImagePaths, // Store image paths as an array
      price: price,
      offerPrice: offerprice         
    });

    await item.save();

    res.status(201).json({ message: 'Posts created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create image posts' });
  }
});
module.exports = router; 