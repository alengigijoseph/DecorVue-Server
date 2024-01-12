const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  otp:{
    type: Number,
    expires: '5m'
  },
  phoneNumber:{
    type: String,
    unique: true,
    trim: true
  },
  wishListItems: [{
    type: String
  }],
  cartItems: [{
    itemId: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  searches: [{
    type: String
  }],
  address: [{
    type:{
      type: String
    },
    name:{
      type: String
    },
    add:{
      type: String
    }
  }]
});


const User = mongoose.model('User', userSchema);

module.exports = User;