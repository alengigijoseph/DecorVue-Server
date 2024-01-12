const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId:{
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  price:{
    type: String,
    required: true,
    default: 'Rs 1000'
  },
  offerPrice:{
    type: String,
  },
  newArrival: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true,
  },
  rating: {
    type: Number, 
    default: 0,
  },
  about: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isWishlisted:{
    type: Boolean,
    default: false
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
