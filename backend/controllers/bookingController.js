const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

exports.getBookings = asyncHandler(async (req, res, next) => {
  let query;

  // If user is not admin, they can only see their own bookings
  if (req.user.role !== 'admin') {
    query = Booking.find({ user: req.user.id }).populate({
      path: 'listing',
      select: 'title address city country pricePerNight'
    });
  } else {
    // If admin, they can see all bookings
    query = Booking.find().populate({
      path: 'listing',
      select: 'title address city country pricePerNight'
    }).populate({
      path: 'user',
      select: 'name email'
    });
  }

  const bookings = await query;

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: 'listing',
    select: 'title address city country pricePerNight'
  }).populate({
    path: 'user',
    select: 'name email'
  });

  if (!booking) {
    return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to view this booking` });
  }

  res.status(200).json({ success: true, data: booking });
});

exports.createBooking = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id; // Assign the logged-in user as the booker

  const { listing, checkInDate, checkOutDate, guests } = req.body;

  if (!listing || !checkInDate || !checkOutDate || !guests) {
    return res.status(400).json({ success: false, message: 'Please provide listing, check-in, check-out dates and guests' });
  }

  const foundListing = await Listing.findById(listing);

  if (!foundListing) {
    return res.status(404).json({ success: false, message: `Listing not found with id of ${listing}` });
  }

  if (guests > foundListing.guests) {
    return res.status(400).json({ success: false, message: `Number of guests exceeds listing's maximum capacity of ${foundListing.guests}` });
  }

  // Calculate total price 
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((new Date(checkOutDate) - new Date(checkInDate)) / oneDay));
  if (diffDays === 0) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
  }

  req.body.totalPrice = diffDays * foundListing.pricePerNight;

  const booking = await Booking.create(req.body);

  res.status(201).json({ success: true, data: booking });
});

exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this booking` });
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: booking });
});
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this booking` });
  }

  await booking.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
