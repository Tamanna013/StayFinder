// backend/controllers/listingController.js
const Listing = require('../models/Listing');
const asyncHandler = require('../middleware/asyncHandler');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
exports.getListings = asyncHandler(async (req, res, next) => {
  // Basic filtering for now, can add more complex search later
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = Listing.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Listing.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const listings = await query.populate('host', 'name email'); // Populate host details

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: listings.length,
    pagination,
    data: listings
  });
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate('host', 'name email');

  if (!listing) {
    return res.status(404).json({ success: false, message: `Listing not found with id of ${req.params.id}` });
  }

  res.status(200).json({ success: true, data: listing });
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Host only)
exports.createListing = asyncHandler(async (req, res, next) => {
  req.body.host = req.user.id; // Assign the logged-in user as the host

  const listing = await Listing.create(req.body);

  res.status(201).json({ success: true, data: listing });
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Host only, own listing)
exports.updateListing = asyncHandler(async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ success: false, message: `Listing not found with id of ${req.params.id}` });
  }

  // Make sure user is listing host
  if (listing.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this listing` });
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: listing });
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Host only, own listing)
exports.deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ success: false, message: `Listing not found with id of ${req.params.id}` });
  }

  // Make sure user is listing host
  if (listing.host.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this listing` });
  }

  await listing.deleteOne(); // Use deleteOne() instead of remove()

  res.status(200).json({ success: true, data: {} });
});