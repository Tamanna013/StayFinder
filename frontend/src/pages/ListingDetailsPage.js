import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, createBooking } from '../services/api';
import { useAuth } from '../context/authContext';

function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getListingById(id);
        setListing(response.data.data);
      } catch (err) {
        setError('Failed to fetch listing details.');
        console.error('Error fetching listing details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setBookingMessage('Please log in to book this listing.');
      return;
    }

    if (!checkInDate || !checkOutDate || !guests) {
      setBookingMessage('Please fill in all booking details.');
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setBookingMessage('Check-out date must be after check-in date.');
      return;
    }

    if (guests > listing.guests) {
      setBookingMessage(`Number of guests cannot exceed ${listing.guests}.`);
      return;
    }

    try {
      const bookingData = {
        listing: listing._id,
        checkInDate,
        checkOutDate,
        guests: parseInt(guests),
      };
      await createBooking(bookingData);
      setBookingMessage('Booking successful!');
      setCheckInDate('');
      setCheckOutDate('');
      setGuests(1);
    } catch (err) {
      setBookingMessage(err.response?.data?.message || 'Booking failed. Please try again.');
      console.error('Error creating booking:', err);
    }
  };

  if (loading) return <div className="container p-4">Loading listing details...</div>;
  if (error) return <div className="container p-4 text-red-600">{error}</div>;
  if (!listing) return <div className="container p-4">Listing not found.</div>;

  return (
    <div className="container mx-auto mt-6 p-4 grid lg:grid-cols-3 gap-8 bg-white rounded-lg shadow-lg">
      {/* Images */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {listing.images.length > 0 ? (
          listing.images.map((img, index) => (
            <img key={index} src={img} alt={`img-${index}`} className="w-full h-64 object-cover rounded-md" />
          ))
        ) : (
          <img src="https://via.placeholder.com/600x400?text=No+Image" alt="No Image" className="w-full h-64 object-cover rounded-md" />
        )}
      </div>

      {/* Info & Booking */}
      <div className="flex flex-col gap-6">
        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{listing.title}</h1>
          <p className="text-gray-500 mb-4">{listing.address}, {listing.city}, {listing.country}</p>
          <p className="text-gray-700 mb-4">{listing.description}</p>
          <p className="text-blue-600 text-xl font-semibold mb-4">${listing.pricePerNight} / night</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600 border-t pt-3">
            <p><strong>Guests:</strong> {listing.guests}</p>
            <p><strong>Bedrooms:</strong> {listing.bedrooms}</p>
            <p><strong>Bathrooms:</strong> {listing.bathrooms}</p>
          </div>

          {/* Amenities */}
          {listing.amenities.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Amenities</h3>
              <ul className="flex flex-wrap gap-2 text-sm text-gray-600">
                {listing.amenities.map((amenity, index) => (
                  <li key={index} className="bg-gray-200 px-3 py-1 rounded-full">{amenity}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Host */}
          <p className="mt-4 text-sm italic text-gray-500 border-t pt-3">
            Hosted by: {listing.host?.name || 'N/A'}
          </p>
        </div>

        {/* Booking Form */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-center text-xl font-bold text-gray-800 mb-4">Book Your Stay</h2>
          <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Check-in Date</label>
              <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required
                className="w-full mt-1 p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Check-out Date</label>
              <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required
                className="w-full mt-1 p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Guests</label>
              <input type="number" min="1" max={listing.guests} value={guests}
                onChange={(e) => setGuests(e.target.value)} required
                className="w-full mt-1 p-2 border border-gray-300 rounded" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-all">
              Book Now
            </button>
            {bookingMessage && <p className="text-center font-semibold text-red-500 mt-2">{bookingMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailsPage;
