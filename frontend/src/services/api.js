// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ensure this matches your backend port

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// User Auth
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (userData) => api.post('/users/login', userData);

// Listings
export const getListings = () => api.get('/listings');
export const getListingById = (id) => api.get(`/listings/${id}`);
export const createListing = (listingData) => api.post('/listings', listingData);
export const updateListing = (id, listingData) => api.put(`/listings/${id}`, listingData);
export const deleteListing = (id) => api.delete(`/listings/${id}`);

// Bookings
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getUserBookings = () => api.get('/bookings'); // For a logged-in user

export default api;