import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { createListing, getListings, updateListing, deleteListing } from '../services/api';
import { useNavigate } from 'react-router-dom';

function HostDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [listingForm, setListingForm] = useState({
    title: '', description: '', address: '', city: '', country: '',
    pricePerNight: '', guests: '', bedrooms: '', bathrooms: '',
    amenities: '', images: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [formMessage, setFormMessage] = useState('');
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'host')) {
      navigate('/');
    } else if (user && user.role === 'host') {
      fetchMyListings();
    }
  }, [user, authLoading, navigate]);

  const fetchMyListings = async () => {
    setListingsLoading(true);
    setListingsError('');
    try {
      const response = await getListings();
      const userListings = response.data.data.filter(listing => listing.host?._id === user.id);
      setMyListings(userListings);
    } catch (err) {
      setListingsError('Failed to fetch your listings.');
      console.error(err);
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
      fetchMyListings();
      resetForm();
    } catch (err) {
      setFormMessage(err.response?.data?.message || 'Failed to save listing.');
      console.error(err);
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
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setCurrentListingId(null);
    setListingForm({
      title: '', description: '', address: '', city: '', country: '',
      pricePerNight: '', guests: '', bedrooms: '', bathrooms: '',
      amenities: '', images: ''
    });
  };

  if (authLoading) return <div className="p-6 text-center">Loading user data...</div>;
  if (!user || user.role !== 'host') return <div className="p-6 text-center">You must be logged in as a host to access this page.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Host Dashboard</h1>

      <div className="mb-10 p-6 border border-gray-200 bg-gray-50 rounded-lg">
        <h2 className="text-xl text-blue-600 font-semibold text-center mb-6">{editMode ? 'Edit Listing' : 'Add New Listing'}</h2>
        {formMessage && <p className="text-center text-green-600 font-semibold mb-4">{formMessage}</p>}

        <form onSubmit={handleAddOrUpdateListing} className="space-y-4">
          {[
            { label: 'Title', name: 'title' },
            { label: 'Description', name: 'description', type: 'textarea' },
            { label: 'Address', name: 'address' },
            { label: 'City', name: 'city' },
            { label: 'Country', name: 'country' },
            { label: 'Price Per Night', name: 'pricePerNight', type: 'number' },
            { label: 'Max Guests', name: 'guests', type: 'number' },
            { label: 'Bedrooms', name: 'bedrooms', type: 'number' },
            { label: 'Bathrooms', name: 'bathrooms', type: 'number' },
            { label: 'Amenities (comma separated)', name: 'amenities' },
            { label: 'Image URLs (comma separated)', name: 'images' }
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              <label className="block font-semibold text-gray-700 mb-1">{label}:</label>
              {type === 'textarea' ? (
                <textarea name={name} value={listingForm[name]} onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md resize-vertical min-h-[80px]" required />
              ) : (
                <input type={type} name={name} value={listingForm[name]} onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md" required />
              )}
            </div>
          ))}

          <div className="flex items-center space-x-4 pt-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">{editMode ? 'Update Listing' : 'Add Listing'}</button>
            {editMode && <button type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">Cancel Edit</button>}
          </div>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl text-blue-600 font-semibold text-center mb-6">My Listings</h2>
        {listingsLoading ? (
          <p className="text-center">Loading your listings...</p>
        ) : listingsError ? (
          <p className="text-center text-red-600">{listingsError}</p>
        ) : myListings.length === 0 ? (
          <p className="text-center text-gray-600">You haven't added any listings yet. Use the form above to add one!</p>
        ) : (
          <div className="grid gap-4">
            {myListings.map(listing => (
              <div key={listing._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <img src={listing.images[0] || 'https://via.placeholder.com/100'} alt={listing.title}
                  className="w-24 h-20 object-cover rounded-md" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                  <p className="text-sm text-gray-600">{listing.city}, {listing.country}</p>
                  <p className="text-sm text-gray-800 font-medium">${listing.pricePerNight} / night</p>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <button onClick={() => handleEditClick(listing)} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-1 rounded-md">Edit</button>
                  <button onClick={() => handleDeleteClick(listing._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">Delete</button>
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
