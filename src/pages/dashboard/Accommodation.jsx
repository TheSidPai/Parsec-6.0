import React, { useState, useEffect } from 'react';
import './Accommodation.css';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa';
import { API_ENDPOINTS, authenticatedFetch, getAuthToken, API_BASE_URL } from '../../config/api';

// Accommodation configuration
const ACCOMMODATION_CONFIG = {
  pricePerNight: 700,
  eventDates: {
    start: '2026-01-23',
    end: '2026-01-27'
  },
  availableDates: ['2026-01-23', '2026-01-24', '2026-01-25', '2026-01-26', '2026-01-27'],
  minDate: '2026-01-23',
  maxDate: '2026-01-27'
};

// API functions for accommodation
const accommodationAPI = {
  // Fetch user's bookings
  fetchBookings: async () => {
    try {
      const token = getAuthToken();
      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.ACCOMMODATION_MY_BOOKINGS,
        { method: 'GET' },
        token
      );

      console.log('📦 Accommodation API Response:', { response, data });

      // If response is not ok, return empty array instead of throwing
      if (!response.ok) {
        console.warn('⚠️ API returned non-ok status, returning empty bookings');
        return [];
      }

      // Handle multiple response structures
      let accommodationBookings = [];

      // Try different data structures
      if (data?.data?.orders && Array.isArray(data.data.orders)) {
        accommodationBookings = data.data.orders
          .filter(order => order.referenceType === 'AccommodationBooking')
          .map(order => ({
            _id: order._id,
            checkInDate: order.referenceId?.checkInDate,
            checkOutDate: order.referenceId?.checkOutDate,
            numberOfNights: order.referenceId?.numberOfNights,
            totalPrice: order.referenceId?.totalPrice,
            status: order.referenceId?.status,
            paymentStatus: order.referenceId?.paymentStatus,
            createdAt: order.createdAt
          }));
      } else if (Array.isArray(data?.data)) {
        accommodationBookings = data.data;
      } else if (data?.success && Array.isArray(data?.data?.bookings)) {
        accommodationBookings = data.data.bookings;
      } else if (data?.data?.bookings && Array.isArray(data.data.bookings)) {
        accommodationBookings = data.data.bookings;
      }

      console.log('✅ Processed bookings:', accommodationBookings);
      return accommodationBookings || [];
    } catch (error) {
      console.error('❌ Fetch bookings error:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  // Create accommodation booking
  createBooking: async (checkInDate, checkOutDate) => {
    try {
      const token = getAuthToken();
      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.ACCOMMODATION_CREATE,
        {
          method: 'POST',
          body: JSON.stringify({ checkInDate, checkOutDate })
        },
        token
      );

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create booking');
      }

      return data.data.booking;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },

  // Submit payment for booking
  submitPayment: async (bookingId, amount, paymentUTR, paymentScreenshot) => {
    try {
      const token = getAuthToken();
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('bookingId', bookingId);
      formData.append('amount', amount);
      formData.append('paymentUTR', paymentUTR);
      if (paymentScreenshot) {
        formData.append('paymentScreenshot', paymentScreenshot);
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.PAYMENTS_SUBMIT}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: formData // Don't set Content-Type, browser will set it with boundary
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to submit payment');
      }

      return data.data.payment;
    } catch (error) {
      console.error('Submit payment error:', error);
      throw error;
    }
  }
};

function Accommodation() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Details, 2: Payment
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: '',
    checkOutDate: '',
    utr: '',
    paymentScreenshot: null
  });
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Calculate nights and price
  const calculateBooking = () => {
    const { checkInDate, checkOutDate } = bookingDetails;
    if (!checkInDate || !checkOutDate) return { nights: 0, price: 0 };
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const price = nights * ACCOMMODATION_CONFIG.pricePerNight;
    
    return { nights: nights > 0 ? nights : 0, price: price > 0 ? price : 0 };
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accommodationAPI.fetchBookings();
      setBookings(data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      // Don't show error if it's just an empty response
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = () => {
    setShowModal(true);
    setModalStep(1);
    setError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalStep(1);
    setBookingDetails({
      checkInDate: '',
      checkOutDate: '',
      utr: '',
      paymentScreenshot: null
    });
    setPaymentData(null);
    setError(null);
  };

  const handleNextStep = async () => {
    if (modalStep === 1) {
      // Validate Step 1 fields
      const { checkInDate, checkOutDate } = bookingDetails;
      
      if (!checkInDate || !checkOutDate) {
        setError('Please select check-in and check-out dates');
        return;
      }

      const { nights } = calculateBooking();
      if (nights <= 0) {
        setError('Check-out date must be after check-in date');
        return;
      }

      // Create booking via API
      try {
        setSubmitting(true);
        setError(null);

        const booking = await accommodationAPI.createBooking(
          checkInDate,
          checkOutDate
        );

        // Store booking data for payment step
        setPaymentData({
          bookingId: booking._id,
          totalPrice: booking.totalPrice,
          numberOfNights: booking.numberOfNights,
          qrCodeUrl: '/ViditQRCode.jpeg',
          upiId: 'viditparikh@sbi'
        });

        setModalStep(2);
      } catch (error) {
        setError(error.message || 'Failed to create booking. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handlePrevStep = () => {
    if (modalStep > 1) {
      setModalStep(modalStep - 1);
      setError(null);
    }
  };

  const handleSubmitPayment = async () => {
    const { utr, paymentScreenshot } = bookingDetails;
    
    if (!utr || utr.trim().length === 0) {
      setError('Please enter UTR/Transaction ID');
      return;
    }

    if (!paymentScreenshot) {
      setError('Please upload payment screenshot');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await accommodationAPI.submitPayment(
        paymentData.bookingId,
        paymentData.totalPrice,
        utr.trim(),
        paymentScreenshot
      );

      // Success - show confirmation message
      alert('Payment submitted successfully!\n\nYour payment is under review by our admin team. You will receive a verification email once the payment is confirmed.\n\nThank you for your patience!');
      closeModal();
      loadBookings();
    } catch (error) {
      setError(error.message || 'Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
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
            {/* <div className="wand-divider left"></div> */}
            <h1 className="page-title">
              Accommodation
            </h1>
            {/* <div className="wand-divider right"></div> */}
          </div>
          <p className="page-subtitle">
            Book your stay at IIT Dharwad for Parsec 2026
          </p>
        </div>

        {/* Booking Section */}
        <div className="pass-options-section">
          <h2 className="section-title">Book Accommodation</h2>
          
          <div className="accommodation-info">
            <div className="info-card">
              <h3>Accommodation Details</h3>
              <ul>
                <li>✓ Accommodation and Food included</li>
                <li>✓ Access to all events and activities</li>
                <li>✓ Cultural Night access</li>
                <li>✓ Welcome Kit and Swaggets</li>
              </ul>
              <p className="price-info">
                <strong>Price:</strong> ₹{ACCOMMODATION_CONFIG.pricePerNight} per night
              </p>
            </div>

            <div className="booking-cta">
              <button 
                className="leather-span book-btn primary-btn"
                onClick={openBookingModal}
              >
                Book Accommodation
              </button>
            </div>
          </div>

          <div className="accommodation-note">
            <p><strong>Event Dates:</strong> 23rd - 27th January 2026</p>
            <p><strong>Important:</strong> Booking for date X covers 12:00 PM on date X till 10:00 AM on date X+1</p>
            <p className="portal-info">
              Accommodation is available on a first-come, first-serve basis. Limited slots available.
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
              <p>No bookings yet. Book your accommodation above!</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>Accommodation Booking</h3>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="booking-details">
                    <p><FaCalendarAlt /> {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                    <p><strong>Nights:</strong> {booking.numberOfNights}</p>
                    <p className="booking-amount">₹{booking.totalPrice}</p>
                    <p className="booking-status">Payment: {booking.paymentStatus}</p>
                    <p className="booking-date">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString()}
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
        <div className="accommodation-modal-overlay" onClick={closeModal}>
          <div className="accommodation-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="accommodation-modal-close" onClick={closeModal}>
              <FaTimes />
            </button>

            {/* Step Indicator */}
            <div className="accommodation-modal-steps">
              <div className={`step ${modalStep >= 1 ? 'active' : ''}`}>1. Booking Details</div>
              <div className={`step ${modalStep >= 2 ? 'active' : ''}`}>2. Payment</div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="modal-error-message">
                {error}
              </div>
            )}

            {/* Step 1: Booking Details Form */}
            {modalStep === 1 && (
              <div className="accommodation-modal-step">
                <h2>Booking Details</h2>
                <form className="booking-form">
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input
                      type="date"
                      min={ACCOMMODATION_CONFIG.minDate}
                      max={ACCOMMODATION_CONFIG.maxDate}
                      value={bookingDetails.checkInDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, checkInDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Check-out Date *</label>
                    <input
                      type="date"
                      min={ACCOMMODATION_CONFIG.minDate}
                      max={ACCOMMODATION_CONFIG.maxDate}
                      value={bookingDetails.checkOutDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, checkOutDate: e.target.value})}
                      required
                    />
                  </div>

                  {bookingDetails.checkInDate && bookingDetails.checkOutDate && (
                    <div className="booking-summary">
                      <p><strong>Number of Nights:</strong> {calculateBooking().nights}</p>
                      <p><strong>Total Price:</strong> ₹{calculateBooking().price}</p>
                    </div>
                  )}

                  <div className="form-note">
                    <p>ℹ️ Your contact details are already registered with your account.</p>
                  </div>
                </form>

                <div className="accommodation-modal-actions">
                  <button className="leather-span btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button 
                    className="leather-span btn btn-primary" 
                    onClick={handleNextStep}
                    disabled={submitting}
                  >
                    {submitting ? 'Creating Booking...' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment QR Code & UTR */}
            {modalStep === 2 && paymentData && (
              <div className="accommodation-modal-step payment-step">
                <h2>Complete Payment</h2>
                <div className="payment-info">
                  <p className="payment-amount">Amount: ₹{paymentData.totalPrice}</p>
                  <p className="payment-nights">{paymentData.numberOfNights} night(s)</p>
                  <div className="qr-code-container">
                    <img src={paymentData.qrCodeUrl} alt="Payment QR Code" />
                  </div>
                  <p className="upi-id">UPI ID: {paymentData.upiId}</p>
                  <div className="payment-instructions">
                    <p>1. Scan the QR code using any UPI app</p>
                    <p>2. Enter the exact amount: ₹{paymentData.totalPrice}</p>
                    <p>3. Complete the payment</p>
                    <p>4. Enter the UTR/Transaction ID below</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>UTR / Transaction ID *</label>
                  <input
                    type="text"
                    value={bookingDetails.utr}
                    onChange={(e) => setBookingDetails({...bookingDetails, utr: e.target.value})}
                    placeholder="Enter 12-digit UTR number"
                    required
                  />
                  <small>Find this in your payment app after completing the transaction</small>
                </div>

                <div className="form-group">
                  <label>Payment Screenshot *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          setError('Image size must be less than 5MB');
                          e.target.value = '';
                          return;
                        }
                        setBookingDetails({...bookingDetails, paymentScreenshot: file});
                        setError(null);
                      }
                    }}
                    required
                  />
                  <small>Upload a clear screenshot of your payment confirmation (Max 5MB)</small>
                  {bookingDetails.paymentScreenshot && (
                    <div style={{ marginTop: '8px', color: '#28a745', fontSize: '13px' }}>
                      ✓ {bookingDetails.paymentScreenshot.name}
                    </div>
                  )}
                </div>

                <div className="form-note payment-note">
                  <p>
                    <strong>ℹ️ Note:</strong> Your payment will be manually verified by our admin team. 
                    You will receive a confirmation email once verified. Please ensure the screenshot is clear and shows the transaction details.
                  </p>
                </div>

                <div className="accommodation-modal-actions">
                  <button className="leather-span btn btn-secondary" onClick={handlePrevStep} disabled={submitting}>Back</button>
                  <button 
                    className="leather-span btn btn-primary" 
                    onClick={handleSubmitPayment}
                    disabled={!bookingDetails.utr || !bookingDetails.paymentScreenshot || submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Payment for Verification'}
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
