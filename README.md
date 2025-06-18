# StayFinder
StayFinder is a full-stack web application, akin to Airbnb, allowing users to list and book properties for short or long-term stays. It showcases a comprehensive understanding of the MERN stack.

## Features
### User Authentication: 
Secure registration and login (JWT).
### Property Listings: 
Browse properties with key details.
### Listing Details: 
Dedicated pages with full property info.
### Basic Booking: 
Guests can reserve properties by selecting dates and guests.
🛠️ Tech Stack
**Frontend:** React, React Router DOM, Axios, Tailwind CSS.
**Backend:** Node.js, Express.js (RESTful API), Mongoose (MongoDB ODM), JWT, Bcrypt.js.
**Database:** MongoDB.
## Getting Started
### Prerequisites
Node.js (LTS)<br>
MongoDB<br>
### Setup & Run
**Clone:** 
```
git clone <your-repo-url> && cd stayfinder
```
**Backend:**
```
cd backend && npm install
```
**Create .env:**
Code snippet
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```
**Frontend:**
```
cd ../frontend && npm install
```
**Seed Data (Optional):**
```
cd ../backend
node seeder -d
node seeder -i
```
**Start Servers:**
```
cd backend && npm run dev
cd ../frontend && npm start
```

## Key API Endpoints
```POST /api/users/register```: Register a user.<br>
```POST /api/users/login```: Log in.<br>
```GET /api/listings```: Get all listings (supports search/filters).<br>
```GET /api/listings/:id```: Get a single listing.<br>
```POST /api/bookings```: Create a booking (authenticated).<br>
