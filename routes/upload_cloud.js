/* const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const { v4: uuidv4 } = require('uuid'); 
const Item = require('../models/item');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'caramel-theory-395512',
  keyFilename: 'caramel-theory-395512-3e35ae64b4f7.json' 
});
const bucket = storage.bucket('customar_images');

const upload = multer({
  storage: multer.memoryStorage()
});

router.post('/create', upload.array('images', 10), async (req, res) => {
  try {
    const itemname = req.body.itemname;
    const itemdesc = req.body.itemdesc;
    const itemcat = req.body.itemcat;
    const price = req.body.price;
    const offerprice = req.body.offerprice;
    const commonItemId = uuidv4(); // Generate a unique itemId for this group of images
    
    const imageUrls = [];

    for (const file of req.files) {
      const extension = file.originalname.split('.').pop();
      const newFilename = `image-${uuidv4()}.${extension}`;
      const filePath = `${commonItemId}/${newFilename}`;
      
      const blob = bucket.file(filePath);
      const blobStream = blob.createWriteStream();
      
      blobStream.on('error', (err) => {
        console.error(err);
      });
      
      blobStream.on('finish', async () => {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        imageUrls.push(imageUrl);

        if (imageUrls.length === req.files.length) {
          // Create an item document with a unique _id value and associate it with the itemId
          const item = new Item({
            itemId: commonItemId, // Store the generated itemId
            itemName: itemname,
            price: price,
            offerPrice: offerprice,
            about: itemdesc,
            category: itemcat,
            images: imageUrls // Store image URLs as an array
          });

          await item.save();

          res.status(201).json({ message: 'Posts created successfully' });
        }
      });
      
      blobStream.end(file.buffer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create image posts' });
  }
});

module.exports = router;
 */