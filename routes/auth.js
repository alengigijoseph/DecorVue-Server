const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

//const fast2smsApiKey = 'NB0GEWuZmx5jcJk9FSfi7QMnePXbpDz26wYoUHdrRa1syV3ChTYUqXDZMs1mBiNGyLKVCJQROu3nxcPk';

router.post('/signupphone', async (req, res) => {
  try {
    const { phoneNumber, password ,name} = req.body;

    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const otp = Math.floor(10000 + Math.random() * 90000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      phoneNumber: phoneNumber,
      name: name,
      password: hashedPassword,
      otp: otp,
    });

    await newUser.save();


    res.status(200).json({ message: 'OTP is'+otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/loginphone', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const otp = Math.floor(10000 + Math.random() * 90000);


    user.otp = otp;
    await user.save();

    res.status(200).json({ message: otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/verifyotp', async (req, res) => {
  try {
    const { phoneNumber, userOtp } = req.body;

    const user = await User.findOne({ phoneNumber: phoneNumber });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (userOtp !== user.otp) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      message: 'OTP verified successfully',
        userId: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        cartItems: user.cartItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;