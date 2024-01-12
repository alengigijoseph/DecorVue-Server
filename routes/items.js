const express = require('express');
const router = express.Router();
const Item = require('../models/item'); 
const User = require('../models/user');


router.get('/mywishlist/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const wishlistItemIds = user.wishListItems;

      const wishlistItems = await Item.find({ _id: { $in: wishlistItemIds } });

      res.status(200).json(wishlistItems);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/mycart/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cartItems = await Promise.all(user.cartItems.map(async (cartItem) => {
      const item = await Item.findOne({ itemId: cartItem.itemId });

      if (!item) {
        console.log("Item not found:", cartItem.itemId);
        return null;
      }
      const isWishlisted = user.wishListItems.includes(cartItem.itemId);

      return {
        item: {
          ...item.toObject(),
          isWishlisted: isWishlisted 
        },
        quantity: cartItem.quantity
      };
    }));

    const validCartItems = cartItems.filter(item => item !== null);

    res.status(200).json(validCartItems);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/newArrivals/recent', async (req, res) => {
  try {
    const items = await Item.find()
      .sort({ newArrival: -1 })
      .limit(5); 
      //const user = await User.findById(userId);

      //const isWishlisted = user.wishListItems.includes(cartItem.itemId);

    const formattedItems = items.map(item => ({
        ...item.toObject(),
        //isWishlisted: isWishlisted 
      }));

    res.json(formattedItems); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

router.get('/newArrivals/all', async (req, res) => {
  try {
    const items = await Item.find(); 
    const user = await User.findById(userId);

    const isWishlisted = user.wishListItems.includes(cartItem.itemId);
    
    const formattedItems = items.map(item => ({
        ...item.toObject(),
        isWishlisted: isWishlisted 
      }));

    res.json(formattedItems); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

router.get('/search', async (req, res) => {

  const { query } = req.query;
  const regex = new RegExp(query, 'i');
  

  try {
    const items = await Item.find({
      $or: [
        { itemName: regex },
        { category: regex },
      ],
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching for items.' });
  }
});

router.get('/autocomplete', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Missing search query' });
    }

    const items = await Item.find({ category: { $regex: query, $options: 'i' } })
      .select('category')
      .limit(10); 

    const formattedNames = items.map(item => item.category);

    res.json(formattedNames); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to perform autocomplete search' });
  }
});

router.post('/addwishlist', async (req, res) => {
  const { userId, itemId } = req.body;

 try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const itemIndex = user.wishListItems.indexOf(itemId);

    if (itemIndex === -1) {
      user.wishListItems.push(itemId);
      await user.save();
      res.status(200).json({ added: true, message: 'Item added to wishlist successfully' });
    } else {
      user.wishListItems.splice(itemIndex, 1);
      await user.save();
      res.status(200).json({ added: false, message: 'Item removed from wishlist successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addtocart', async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingCartItem = user.cartItems.find(item => item.itemId === itemId);

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cartItems.push({ itemId, quantity: 1 });
    }

    await user.save();
    const totalQuantity = user.cartItems.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({ message: 'Item added to cart successfully', quantity: totalQuantity});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/deleteCart', async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingCartItem = user.cartItems.find(item => item.itemId === itemId);

    if (!existingCartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (existingCartItem.quantity > 1) {
      existingCartItem.quantity -= 1;
    } else {
      user.cartItems = user.cartItems.filter(item => item.itemId !== itemId);
    }

    await user.save();
    const totalQuantity = user.cartItems.reduce((total, item) => total + item.quantity, 0);

    res.status(200).json({ message: 'Cart item updated successfully', quantity: totalQuantity });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;