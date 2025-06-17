import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, createBooking } from '../services/api';
import { useAuth } from '../context/authContext';
import './ListingDetailsPage.css'; // Create this CSS file

function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
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
        // totalPrice will be calculated by backend
      };
      await createBooking(bookingData);
      setBookingMessage('Booking successful!');
      setCheckInDate('');
      setCheckOutDate('');
      setGuests(1);
      // Optionally redirect to user's bookings page
      // navigate('/my-bookings');
    } catch (err) {
      setBookingMessage(err.response?.data?.message || 'Booking failed. Please try again.');
      console.error('Error creating booking:', err);
    }
  };

  if (loading) {
    return <div className="container">Loading listing details...</div>;
  }

  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  if (!listing) {
    return <div className="container">Listing not found.</div>;
  }

  return (
    <div className="container listing-details-page">
      <div className="listing-images">
        {listing.images.length > 0 ? (
          listing.images.map((img, index) => (
            <img key={index} src={img} alt={`${listing.title} ${index + 1}`} />
          ))
        ) : (
          <img src="https://via.placeholder.com/600x400?text=No+Image" alt="No Image" />
        )}
      </div>

      <div className="listing-info-section">
        <h1>{listing.title}</h1>
        <p className="location">{listing.address}, {listing.city}, {listing.country}</p>
        <p className="description">{listing.description}</p>
        <p className="price"><strong>${listing.pricePerNight}</strong> / night</p>
        <div className="details-grid">
          <div><strong>Max Guests:</strong> {listing.guests}</div>
          <div><strong>Bedrooms:</strong> {listing.bedrooms}</div>
          <div><strong>Bathrooms:</strong> {listing.bathrooms}</div>
        </div>
        {listing.amenities.length > 0 && (
          <div className="amenities">
            <h3>Amenities:</h3>
            <ul>
              {listing.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="host-info">Hosted by: {listing.host?.name || 'N/A'}</p>
      </div>

      <div className="booking-section">
        <h2>Book Your Stay</h2>
        <form onSubmit={handleBookingSubmit}>
          <div className="form-group">
            <label htmlFor="checkIn">Check-in Date:</label>
            <input
              type="date"
              id="checkIn"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="checkOut">Check-out Date:</label>
            <input
              type="date"
              id="checkOut"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="guests">Number of Guests:</label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              max={listing.guests}
              required
            />
          </div>
          <button type="submit" className="book-button">Book Now</button>
          {bookingMessage && <p className="message">{bookingMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default ListingDetailsPage;