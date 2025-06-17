// backend/models/Listing.js
const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  country: {
    type: String,
    required: [true, 'Please add a country']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please add a price per night'],
    min: [0, 'Price cannot be negative']
  },
  guests: {
    type: Number,
    required: [true, 'Please add max guests'],
    min: [1, 'Must allow at least 1 guest']
  },
  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative'],
    default: 1
  },
  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative'],
    default: 1
  },
  amenities: [String], // Array of strings, e.g., ['wifi', 'kitchen']
  images: [String], // Array of image URLs
  host: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', ListingSchema);