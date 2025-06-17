import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { createListing, getListings, updateListing, deleteListing } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './HostDashboard.css';

function HostDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [listingForm, setListingForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    country: '',
    pricePerNight: '',
    guests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: '', // Comma separated string
    images: '' // Comma separated URLs
  });
  const [editMode, setEditMode] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [formMessage, setFormMessage] = useState('');
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'host')) {
      navigate('/'); // Redirect if not a host or not logged in
    } else if (user && user.role === 'host') {
      fetchMyListings();
    }
  }, [user, authLoading, navigate]);

  const fetchMyListings = async () => {
    setListingsLoading(true);
    setListingsError('');
    try {
      // For a real app, you'd have an API endpoint to get listings by host ID
      // For this prototype, we'll fetch all and filter client-side (less efficient for large data)
      const response = await getListings();
      const userListings = response.data.data.filter(listing => listing.host?._id === user.id);
      setMyListings(userListings);
    } catch (err) {
      setListingsError('Failed to fetch your listings.');
      console.error('Error fetching host listings:', err);
    } finally {
      setListingsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setListingForm({ ...listingForm, [name]: value });
  };

  const handleAddOrUpdateListing = async (e) => {
    e.preventDefault();
    setFormMessage('');

    const payload = {
      ...listingForm,
      pricePerNight: parseFloat(listingForm.pricePerNight),
      guests: parseInt(listingForm.guests),
      bedrooms: parseInt(listingForm.bedrooms),
      bathrooms: parseInt(listingForm.bathrooms),
      amenities: listingForm.amenities.split(',').map(a => a.trim()).filter(a => a !== ''),
      images: listingForm.images.split(',').map(img => img.trim()).filter(img => img !== '')
    };

    try {
      if (editMode) {
        await updateListing(currentListingId, payload);
        setFormMessage('Listing updated successfully!');
      } else {
        await createListing(payload);
        setFormMessage('Listing created successfully!');
      }
      fetchMyListings(); // Refresh the list
      resetForm();
    } catch (err) {
      setFormMessage(err.response?.data?.message || 'Failed to save listing.');
      console.error('Error saving listing:', err);
    }
  };

  const handleEditClick = (listing) => {
    setEditMode(true);
    setCurrentListingId(listing._id);
    setListingForm({
      title: listing.title,
      description: listing.description,
      address: listing.address,
      city: listing.city,
      country: listing.country,
      pricePerNight: listing.pricePerNight.toString(),
      guests: listing.guests.toString(),
      bedrooms: listing.bedrooms.toString(),
      bathrooms: listing.bathrooms.toString(),
      amenities: listing.amenities.join(', '),
      images: listing.images.join(', ')
    });
    setFormMessage('');
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteListing(id);
        setFormMessage('Listing deleted successfully!');
        fetchMyListings();
      } catch (err) {
        setFormMessage(err.response?.data?.message || 'Failed to delete listing.');
        console.error('Error deleting listing:', err);
      }
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setCurrentListingId(null);
    setListingForm({
      title: '',
      description: '',
      address: '',
      city: '',
      country: '',
      pricePerNight: '',
      guests: '',
      bedrooms: '',
      bathrooms: '',
      amenities: '',
      images: ''
    });
  };

  if (authLoading) {
    return <div className="container">Loading user data...</div>;
  }

  if (!user || user.role !== 'host') {
    return <div className="container">You must be logged in as a host to access this page.</div>;
  }

  return (
    <div className="container host-dashboard">
      <h1>Host Dashboard</h1>

      <div className="listing-form-section">
        <h2>{editMode ? 'Edit Listing' : 'Add New Listing'}</h2>
        {formMessage && <p className="form-message">{formMessage}</p>}
        <form onSubmit={handleAddOrUpdateListing}>
          <div className="form-group">
            <label>Title:</label>
            <input type="text" name="title" value={listingForm.title} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" value={listingForm.description} onChange={handleFormChange} required></textarea>
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" value={listingForm.address} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label>City:</label>
            <input type="text" name="city" value={listingForm.city} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input type="text" name="country" value={listingForm.country} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label>Price Per Night:</label>
            <input type="number" name="pricePerNight" value={listingForm.pricePerNight} onChange={handleFormChange} min="0" required />
          </div>
          <div className="form-group">
            <label>Max Guests:</label>
            <input type="number" name="guests" value={listingForm.guests} onChange={handleFormChange} min="1" required />
          </div>
          <div className="form-group">
            <label>Bedrooms:</label>
            <input type="number" name="bedrooms" value={listingForm.bedrooms} onChange={handleFormChange} min="0" />
          </div>
          <div className="form-group">
            <label>Bathrooms:</label>
            <input type="number" name="bathrooms" value={listingForm.bathrooms} onChange={handleFormChange} min="0" />
          </div>
          <div className="form-group">
            <label>Amenities (comma separated):</label>
            <input type="text" name="amenities" value={listingForm.amenities} onChange={handleFormChange} placeholder="Wifi, Kitchen, Pool" />
          </div>
          <div className="form-group">
            <label>Image URLs (comma separated):</label>
            <input type="text" name="images" value={listingForm.images} onChange={handleFormChange} placeholder="http://example.com/img1.jpg, http://example.com/img2.jpg" />
          </div>
          <button type="submit" className="host-button">{editMode ? 'Update Listing' : 'Add Listing'}</button>
          {editMode && <button type="button" onClick={resetForm} className="host-button reset-button">Cancel Edit</button>}
        </form>
      </div>

      <div className="my-listings-section">
        <h2>My Listings</h2>
        {listingsLoading ? (
          <p>Loading your listings...</p>
        ) : listingsError ? (
          <p className="error-message">{listingsError}</p>
        ) : myListings.length === 0 ? (
          <p>You haven't added any listings yet. Use the form above to add one!</p>
        ) : (
          <div className="listings-list">
            {myListings.map(listing => (
              <div key={listing._id} className="listing-item">
                <img src={listing.images[0] || 'https://via.placeholder.com/100'} alt={listing.title} />
                <div className="listing-item-info">
                  <h3>{listing.title}</h3>
                  <p>{listing.city}, {listing.country}</p>
                  <p>${listing.pricePerNight} / night</p>
                </div>
                <div className="listing-item-actions">
                  <button onClick={() => handleEditClick(listing)} className="edit-button">Edit</button>
                  <button onClick={() => handleDeleteClick(listing._id)} className="delete-button">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HostDashboard;