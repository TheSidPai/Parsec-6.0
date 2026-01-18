import React from "react";
import "./Accommodation.css";

function Accommodation() {
  // --- Booking logic and UI commented out for closure period ---
  /*
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Details, 2: Payment
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: "",
    checkOutDate: "",
    utr: "",
    paymentScreenshot: null,
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
      console.error("Failed to load bookings:", error);
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
      checkInDate: "",
      checkOutDate: "",
      utr: "",
      paymentScreenshot: null,
    });
    setPaymentData(null);
    setError(null);
  };

  const handleNextStep = async () => {
    if (modalStep === 1) {
      // Validate Step 1 fields
      const { checkInDate, checkOutDate } = bookingDetails;

      if (!checkInDate || !checkOutDate) {
        setError("Please select check-in and check-out dates");
        return;
      }

      const { nights } = calculateBooking();
      if (nights <= 0) {
        setError("Check-out date must be after check-in date");
        return;
      }

      // Create booking via API
      // ...
    }
  };
  */

  // --- Show closed message only ---
  return (
    <div className="accommodation-container">
      <div className="accommodation-closed-message">
        <h1>Accommodation Bookings Closed</h1>
        <p>Accommodation bookings for Parsec 2026 are now closed.<br/>Thank you for your interest!</p>
      </div>
    </div>
  );
}

export default Accommodation;
