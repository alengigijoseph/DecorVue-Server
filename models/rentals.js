const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
 
});

const Rentals = mongoose.model('Rental', rentalSchema);

module.exports = Rentals;
