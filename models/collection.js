const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  
});


const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;