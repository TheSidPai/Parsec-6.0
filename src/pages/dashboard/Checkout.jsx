import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
// Try direct path with require or use public folder
// import paymentScanner from '../../assets/images/payment_scanner.jpeg';
import './Checkout.css';

function Checkout() {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentUTR, setPaymentUTR] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Review, 2: Create Order, 3: Payment
  const [orderId, setOrderId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null); // Timer for payment step (300 seconds = 5 minutes)
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  const loadCart = useCallback(() => {
    const savedCart = localStorage.getItem('parsec_cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      if (parsed.length === 0) {
        navigate('/dashboard/cart');
      }
      setCart(parsed);
    } else {
      navigate('/dashboard/cart');
    }
  }, [navigate]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Timer effect - start when step 3 is reached, redirect to /shop when expired
  useEffect(() => {
    if (step === 3) {
      // Start the timer when payment step is reached
      if (timeLeft === null) {
        setTimeLeft(300); // 5 minutes
      }
    }
  }, [step, timeLeft]);

  useEffect(() => {
    if (timeLeft === null || step !== 3) return;

    if (timeLeft <= 0) {
      console.log('Timer expired, redirecting to /shop');
      navigate('/dashboard/shop');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, step, navigate]);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setPaymentScreenshot(file);
    }
  };

  const handleCreateOrder = async () => {
    if (!token) {
      alert('Please log in to place an order');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Filter out local admin items (they have IDs starting with "local_")
      const backendItems = cart.filter(item => !item._id.startsWith('local_'));
      const localItems = cart.filter(item => item._id.startsWith('local_'));

      // Check if cart has only local items (no backend sync yet)
      if (backendItems.length === 0 && localItems.length > 0) {
        alert('⚠️ These items are admin-added and not synced with backend yet. Please contact admin to add them to the store system first.');
        setLoading(false);
        return;
      }

      // Format items for API (only backend items with valid IDs)
      const items = backendItems.map(item => ({
        merchId: item._id,
        quantity: item.quantity,
        ...(item.sizesAvailable && item.sizesAvailable.length > 0 
          ? { size: item.selectedSize } 
          : {})
      }));

      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.ORDERS_CREATE,
        {
          method: 'POST',
          body: JSON.stringify({
            items
          })
        },
        token
      );

      if (response.ok && data?.status === 'success' && data?.data?.order) {
        setOrderId(data.data.order._id);
        setStep(3);
        // Clear cart
        localStorage.removeItem('parsec_cart');
      } else {
        alert(data?.message || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPayment = async () => {
    if (!paymentUTR.trim()) {
      alert('Please enter your payment UTR number');
      return;
    }

    if (!paymentScreenshot) {
      alert('Payment screenshot is required. Please upload a valid image.');
      return;
    }

    setLoading(true);
    try {
      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('amount', getTotalPrice());
      formData.append('paymentUTR', paymentUTR.trim());
      formData.append('paymentScreenshot', paymentScreenshot);

      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.PAYMENTS_SUBMIT,
        {
          method: 'POST',
          body: formData
        },
        token
      );

      if (response.ok && data?.status === 'success') {
        alert('✅ Payment submitted successfully! Your payment is now pending admin verification. You will receive an email once it\'s verified.');
        navigate('/dashboard/orders');
      } else {
        alert(data?.message || 'Failed to submit payment');
      }
    } catch (err) {
      console.error('Error submitting payment:', err);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span>Review Order</span>
        </div>
        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span>Create Order</span>
        </div>
        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <span>Payment</span>
        </div>
      </div>

      {/* Step 1: Review Order */}
      {step === 1 && (
        <div className="checkout-section">
          <h2>Review Your Order</h2>

          <div className="checkout-items">
            {cart.map(item => (
              <div key={item._id} className="checkout-item">
                <div className="checkout-item-info">
                  <h3>{item.name}</h3>
                  {item.selectedSize !== 'N/A' && (
                    <p className="checkout-item-size">Size: {item.selectedSize}</p>
                  )}
                  <p className="checkout-item-qty">Quantity: {item.quantity}</p>
                </div>
                <div className="checkout-item-price">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>Total ({getTotalItems()} items):</span>
            <span className="total-amount">₹{getTotalPrice()}</span>
          </div>

          <div className="checkout-address">
            <label htmlFor="shipping">Shipping Address (Optional)</label>
            <textarea
              id="shipping"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your address or leave blank for venue pickup"
              rows="3"
            />
          </div>

          <button
            className="checkout-btn"
            onClick={() => setStep(2)}
          >
            Continue to Order Confirmation →
          </button>
        </div>
      )}

      {/* Step 2: Create Order */}
      {step === 2 && (
        <div className="checkout-section">
          <h2>Confirm Your Order</h2>

          <div className="order-summary">
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{getTotalItems()}</span>
            </div>
            <div className="summary-row">
              <span>Total Amount:</span>
              <span className="amount">₹{getTotalPrice()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shippingAddress || 'Venue Pickup'}</span>
            </div>
          </div>

          <div className="checkout-actions">
            <button
              className="checkout-btn-secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              ← Back
            </button>
            <button
              className="checkout-btn"
              onClick={handleCreateOrder}
              disabled={loading}
            >
              {loading ? 'Creating Order...' : 'Create Order →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="checkout-section">
          {/* Timer Warning - Prominently displayed */}
          {timeLeft !== null && (
            <div style={{
              width: '100%',
              textAlign: 'center',
              marginBottom: '2rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
              border: '2px solid #00ff88',
              borderRadius: '15px',
              boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
            }}>
              <div style={{
                color: '#00ff88',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                textShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
              }}>
                ⏰ You have {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} to complete the order
              </div>
              <div style={{
                color: '#cccccc',
                fontSize: '0.9rem',
                marginTop: '0.5rem'
              }}>
                Page will redirect to shop when timer expires
              </div>
            </div>
          )}

          <h2>Submit Payment Proof</h2>

          <div className="payment-instructions">
            <h3>Payment Instructions:</h3>
            <ol>
              <li>Scan the QR code below or use our UPI ID</li>
              <li>Transfer <strong>₹{getTotalPrice()}</strong> to complete payment</li>
              <li>Take a screenshot of the payment confirmation</li>
              <li>Upload the screenshot and enter the UTR/Transaction ID below</li>
            </ol>
          </div>

          {/* Payment QR Scanner */}
          <div className="payment-scanner-container">
            <h3>Scan to Pay:</h3>
            <div className="payment-qr-wrapper">
              <img 
                src={require('../../assets/images/YashQRCode.jpeg')}
                alt="Payment QR Code" 
                className="payment-qr-code"
                onError={(e) => {
                  console.error("Failed to load QR code image");
                  e.target.style.display = 'none';
                }}
                onLoad={() => console.log("QR code loaded successfully")}
              />
            </div>
            <p className="payment-upi-id">
              <strong>Or use UPI ID:</strong> <code>yashalbhavi765@okhdfcbank</code>
            </p>
          </div>

          <div className="payment-info-box">
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Amount to Pay:</strong> ₹{getTotalPrice()}</p>
            <p className="payment-status-info">
              <span className="status-badge status-pending">⏳ Pending Verification</span>
              <small>Your payment will be verified by admin within 24 hours</small>
            </p>
          </div>

          <div className="payment-input">
            <label htmlFor="utr">Payment UTR / Transaction ID *</label>
            <input
              id="utr"
              type="text"
              value={paymentUTR}
              onChange={(e) => setPaymentUTR(e.target.value)}
              placeholder="Enter your 12-digit UTR number (e.g., 123456789012)"
              maxLength="50"
            />
            <small>You'll receive this after completing payment. Usually 12 digits.</small>
          </div>

          <div className="payment-input">
            <label htmlFor="screenshot">Payment Screenshot *</label>
            <input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
            />
            <small>Upload a clear screenshot of your payment confirmation (Max 5MB)</small>
            {paymentScreenshot && (
              <div style={{ marginTop: '8px', color: '#28a745', fontSize: '13px' }}>
                ✓ {paymentScreenshot.name}
              </div>
            )}
          </div>

          <button
            className="checkout-btn"
            onClick={handleSubmitPayment}
            disabled={loading || !paymentUTR.trim() || !paymentScreenshot}
          >
            {loading ? 'Submitting...' : 'Submit Payment Proof ✓'}
          </button>

          <div className="checkout-note">
            <p>ℹ️ <strong>What happens next?</strong></p>
            <ul>
              <li><strong>Pending:</strong> Your payment is submitted and awaiting admin review</li>
              <li><strong>Verified:</strong> Admin confirms payment - you'll receive email confirmation</li>
              <li><strong>Rejected:</strong> If there's an issue, admin will reach out to you</li>
            </ul>
            <p>Check your email and dashboard for updates!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
