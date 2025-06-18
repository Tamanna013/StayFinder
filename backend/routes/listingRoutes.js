const express = require('express');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing
} = require('../controllers/listingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getListings)
  .post(protect, authorize('host'), createListing);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('host'), updateListing)
  .delete(protect, authorize('host'), deleteListing);

module.exports = router;
