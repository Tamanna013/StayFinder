// backend/seeder.js
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');

// Connect to DB (ensure this connection is successful as per previous steps)
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const listingsData = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/listings.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    // 1. Clear existing data first to avoid duplicates or conflicts
    await User.deleteMany();
    await Listing.deleteMany();
    await Booking.deleteMany();

    // 2. Create Users first
    const createdUsers = await User.create(usersData);

    // Find a host user's ID
    // We assume there's at least one user with role 'host' in your users.json
    const hostUser = createdUsers.find(user => user.role === 'host');
    if (!hostUser) {
      console.error('No host user found in seed data! Please ensure at least one user has role: "host".');
      process.exit(1);
    }
    const hostId = hostUser._id;

    // 3. Assign the host ID to each listing before creating them
    const listingsWithHost = listingsData.map(listing => ({
      ...listing,
      host: hostId // Assign the ID of the host user
    }));

    // 4. Create Listings
    await Listing.create(listingsWithHost);

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Listing.deleteMany();
    await Booking.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}