import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getListings } from '../services/api';
import './HomePage.css'; // Create this CSS file

function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getListings();
        setListings(response.data.data);
      } catch (err) {
        setError('Failed to fetch listings. Please try again later.');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return <div className="container">Loading listings...</div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  return (
    <div className="container homepage">
      <h1>Discover Your Next Stay</h1>
      <div className="listing-grid">
        {listings.map(listing => (
          <Link to={`/listings/${listing._id}`} key={listing._id} className="listing-card">
            <img src={listing.images[0] || 'https://via.placeholder.com/300'} alt={listing.title} />
            <div className="listing-info">
              <h3>{listing.title}</h3>
              <p>{listing.city}, {listing.country}</p>
              <p><strong>${listing.pricePerNight}</strong> / night</p>
            </div>
          </Link>
        ))}
        {listings.length === 0 && (
          <p>No listings found. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;