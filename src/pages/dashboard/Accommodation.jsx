import React, { useState, useEffect } from 'react';
import './Accommodation.css';
import { FaBed, FaCalendarAlt, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';

// Accommodation pass data - easily replaceable with API
const PASS_OPTIONS = [
  {
    id: 'day-pass-1',
    name: 'Day Pass 1',
    dates: '24th, 26th Jan',
    price: 300,
    accommodation: false,
    campusAccess: true,
    culturalNight: false,
    welcomeKit: false
  },
  {
    id: 'day-pass-2',
    name: 'Day Pass 2',
    dates: '25th Jan',
    price: 500,
    accommodation: false,
    campusAccess: true,
    culturalNight: true,
    welcomeKit: false
  },
  {
    id: 'one-day',
    name: 'One Day Accommodation',
    dates: 'Select Date',
    price: 700,
    accommodation: true,
    campusAccess: true,
    culturalNight: true,
    welcomeKit: true
  },
  {
    id: 'two-day',
    name: 'Two Day Accommodation',
    dates: 'Select Dates',
    price: 1400,
    accommodation: true,
    campusAccess: true,
    culturalNight: true,
    welcomeKit: true
  },
  {
    id: 'three-day',
    name: 'Three Day Accommodation',
    dates: 'Select Dates',
    price: 2100,
    accommodation: true,
    campusAccess: true,
    culturalNight: true,
    welcomeKit: true
  },
  {
    id: 'four-day',
    name: 'Four Day Accommodation',
    dates: 'Select Dates',
    price: 2800,
    accommodation: true,
    campusAccess: true,
    culturalNight: true,
    welcomeKit: true
  }
];

// Dummy API functions - replace with real API calls later
const accommodationAPI = {
  fetchBookings: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      // Example booking structure
      // {
      //   id: 'booking-1',
      //   passType: 'Two Day Accommodation',
      //   dates: '24th - 25th Jan',
      //   amount: 1400,
      //   status: 'pending', // pending, confirmed, rejected
      //   bookedAt: new Date().toISOString()
      // }
    ];
  },
  
  submitBooking: async (bookingData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      bookingId: 'booking-' + Date.now(),
      message: 'Booking submitted successfully'
    };
  },
  
  generatePaymentQR: async (bookingId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      qrCodeUrl: 'https://via.placeholder.com/300x300?text=Payment+QR+Code',
      upiId: 'parsec@iitdh',
      amount: 1400
    };
  }
};

function Accommodation() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Select Pass, 2: Details, 3: Payment
  const [selectedPass, setSelectedPass] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '',
    checkOutDate: '',
    name: '',
    email: '',
    phone: '',
    idProof: ''
  });
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await accommodationAPI.fetchBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (pass) => {
    setSelectedPass(pass);
    setModalStep(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep(1);
    setSelectedPass(null);
    setBookingDetails({
      checkInDate: '',
      checkOutDate: '',
      name: '',
      email: '',
      phone: '',
      idProof: ''
    });
    setPaymentData(null);
  };

  const handleNextStep = async () => {
    if (modalStep === 1) {
      setModalStep(2);
    } else if (modalStep === 2) {
      // Submit booking and move to payment
      try {
        const booking = {
          passType: selectedPass.name,
          ...bookingDetails,
          amount: selectedPass.price
        };
        const response = await accommodationAPI.submitBooking(booking);
        
        if (response.success) {
          const payment = await accommodationAPI.generatePaymentQR(response.bookingId);
          setPaymentData(payment);
          setModalStep(3);
        }
      } catch (error) {
        console.error('Booking failed:', error);
        alert('Failed to submit booking. Please try again.');
      }
    } else if (modalStep === 3) {
      // Payment completed, refresh bookings and close
      await loadBookings();
      closeModal();
    }
  };

  const handlePrevStep = () => {
    if (modalStep > 1) {
      setModalStep(modalStep - 1);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending Verification', color: '#f59e0b', icon: FaClock },
      confirmed: { label: 'Confirmed', color: '#10b981', icon: FaCheckCircle },
      rejected: { label: 'Rejected', color: '#ef4444', icon: FaTimes }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className="status-badge" style={{ color: config.color }}>
        <Icon /> {config.label}
      </span>
    );
  };

  return (
    <div className="accommodation-page">
      <div className="accommodation-container">
        {/* Header */}
        <div className="accommodation-header">
          <div className="title-wrapper">
            <div className="wand-divider left"></div>
            <h1 className="page-title">
              Accommodation
            </h1>
            <div className="wand-divider right"></div>
          </div>
          <p className="page-subtitle">
            Book your stay at IIT Dharwad for Parsec 2026
          </p>
        </div>

        {/* Pass Options Table */}
        <div className="pass-options-section">
          <h2 className="section-title">Available Passes</h2>
          
          <div className="passes-table-wrapper">
            <table className="passes-table">
              <thead>
                <tr>
                  <th>Pass Type</th>
                  <th>Dates</th>
                  <th>Cost (INR)</th>
                  <th>Accommodation</th>
                  <th>Campus Access</th>
                  <th>Cultural Night</th>
                  <th>Welcome Kit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {PASS_OPTIONS.map(pass => (
                  <tr key={pass.id}>
                    <td className="pass-name">{pass.name}</td>
                    <td>{pass.dates}</td>
                    <td className="price">₹{pass.price}</td>
                    <td>{pass.accommodation ? '✓' : '—'}</td>
                    <td>{pass.campusAccess ? '✓' : '—'}</td>
                    <td>{pass.culturalNight ? '✓' : '—'}</td>
                    <td>{pass.welcomeKit ? '✓' : '—'}</td>
                    <td>
                      <button 
                        className="book-btn"
                        onClick={() => openBookingModal(pass)}
                      >
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="accommodation-note">
            <p><strong>Note:</strong> Accommodation for 23rd January 2026 is an additional charge of Rs. 700</p>
            <p><strong>Important:</strong> For night passes, booking for date X covers 12:00 PM on date X till 10:00 AM on date X+1</p>
            <p className="portal-info">
              Accommodation portal goes live on 7th January 2026, 9:00 AM on a first-come, first-serve basis. Limited accommodation available.
            </p>
          </div>
        </div>

        {/* Booking History */}
        <div className="booking-history-section">
          <h2 className="section-title">Your Bookings</h2>
          
          {loading ? (
            <div className="loading-message">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <FaCalendarAlt className="empty-icon" />
              <p>No bookings yet. Book your first accommodation pass above!</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.passType}</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="booking-details">
                    <p><FaCalendarAlt /> {booking.dates}</p>
                    <p className="booking-amount">₹{booking.amount}</p>
                    <p className="booking-date">
                      Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>

            {/* Step Indicator */}
            <div className="modal-steps">
              <div className={`step ${modalStep >= 1 ? 'active' : ''}`}>1. Select Pass</div>
              <div className={`step ${modalStep >= 2 ? 'active' : ''}`}>2. Details</div>
              <div className={`step ${modalStep >= 3 ? 'active' : ''}`}>3. Payment</div>
            </div>

            {/* Step 1: Pass Selection Summary */}
            {modalStep === 1 && selectedPass && (
              <div className="modal-step">
                <h2>Selected Pass</h2>
                <div className="pass-summary">
                  <h3>{selectedPass.name}</h3>
                  <p className="pass-price">₹{selectedPass.price}</p>
                  <ul className="pass-benefits">
                    {selectedPass.accommodation && <li>✓ Accommodation and Food</li>}
                    {selectedPass.campusAccess && <li>✓ Access to all events and activities</li>}
                    {selectedPass.culturalNight && <li>✓ Cultural Night</li>}
                    {selectedPass.welcomeKit && <li>✓ Welcome Kit and other Swaggets</li>}
                  </ul>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleNextStep}>Continue</button>
                </div>
              </div>
            )}

            {/* Step 2: Booking Details Form */}
            {modalStep === 2 && (
              <div className="modal-step">
                <h2>Booking Details</h2>
                <form className="booking-form">
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input
                      type="date"
                      value={bookingDetails.checkInDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, checkInDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  {selectedPass.accommodation && (
                    <div className="form-group">
                      <label>Check-out Date *</label>
                      <input
                        type="date"
                        value={bookingDetails.checkOutDate}
                        onChange={(e) => setBookingDetails({...bookingDetails, checkOutDate: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={bookingDetails.name}
                      onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={bookingDetails.email}
                      onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingDetails.phone}
                      onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})}
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ID Proof Number *</label>
                    <input
                      type="text"
                      value={bookingDetails.idProof}
                      onChange={(e) => setBookingDetails({...bookingDetails, idProof: e.target.value})}
                      placeholder="Aadhaar / PAN / Passport"
                      required
                    />
                  </div>
                </form>

                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={handlePrevStep}>Back</button>
                  <button className="btn btn-primary" onClick={handleNextStep}>Proceed to Payment</button>
                </div>
              </div>
            )}

            {/* Step 3: Payment QR Code */}
            {modalStep === 3 && paymentData && (
              <div className="modal-step payment-step">
                <h2>Complete Payment</h2>
                <div className="payment-info">
                  <p className="payment-amount">Amount: ₹{selectedPass.price}</p>
                  <div className="qr-code-container">
                    <img src={paymentData.qrCodeUrl} alt="Payment QR Code" />
                  </div>
                  <p className="upi-id">UPI ID: {paymentData.upiId}</p>
                  <div className="payment-instructions">
                    <p>1. Scan the QR code using any UPI app</p>
                    <p>2. Enter the exact amount shown above</p>
                    <p>3. Complete the payment</p>
                    <p>4. Your booking will be under verification</p>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-primary" onClick={handleNextStep}>
                    I've Completed Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Accommodation;
