import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getListings } from '../services/api';

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
    return <div className="container text-center py-10 text-lg font-semibold">Loading listings...</div>;
  }

  if (error) {
    return <div className="container text-center py-10 text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Discover Your Next Stay</h1>

      {listings.length === 0 ? (
        <p className="text-center text-gray-500">No listings found. Be the first to add one!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <Link
              to={`/listings/${listing._id}`}
              key={listing._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 overflow-hidden"
            >
              <img
                src={listing.images[0] || 'https://via.placeholder.com/300'}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-1">{listing.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{listing.city}, {listing.country}</p>
                <p className="text-sm text-gray-800 font-bold">${listing.pricePerNight} <span className="text-gray-500 font-normal">/ night</span></p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
