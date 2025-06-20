const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true }); // mergeParams needed if nested routes

router.route('/')
  .get(protect, getBookings)
  .post(protect, authorize('user'), createBooking);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, authorize('user'), updateBooking)
  .delete(protect, authorize('user'), deleteBooking);

module.exports = router;
