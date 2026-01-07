import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import paymentScanner from '../../assets/images/payment_scanner.jpeg';
import './Checkout.css';

function Checkout() {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentUTR, setPaymentUTR] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Review, 2: Create Order, 3: Payment
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
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
  };

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
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
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
      const confirm = window.confirm('No screenshot uploaded. Are you sure you want to continue? This may delay verification.');
      if (!confirm) return;
    }

    setLoading(true);
    try {
      // Prepare payment data
      const paymentData = {
        orderId,
        amount: getTotalPrice(),
        paymentUTR: paymentUTR.trim()
      };

      // If screenshot exists, add it as base64
      if (screenshotPreview) {
        paymentData.paymentScreenshot = screenshotPreview;
      }

      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.PAYMENTS_SUBMIT,
        {
          method: 'POST',
          body: JSON.stringify(paymentData)
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
                src={paymentScanner} 
                alt="Payment QR Code" 
                className="payment-qr-code"
              />
            </div>
            <p className="payment-upi-id">
              <strong>Or use UPI ID:</strong> <code>parsec@iitdh</code>
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

          {/* Screenshot Upload */}
          <div className="payment-screenshot-section">
            <label htmlFor="screenshot" className="screenshot-label">
              Payment Screenshot (Recommended) *
            </label>
            <input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
              className="screenshot-input"
            />
            <small className="screenshot-help">
              Upload a screenshot of your payment confirmation. This helps speed up verification.
            </small>
            
            {screenshotPreview && (
              <div className="screenshot-preview">
                <h4>Screenshot Preview:</h4>
                <img src={screenshotPreview} alt="Payment Screenshot" />
                <button
                  type="button"
                  className="remove-screenshot-btn"
                  onClick={() => {
                    setPaymentScreenshot(null);
                    setScreenshotPreview(null);
                  }}
                >
                  ✕ Remove Screenshot
                </button>
              </div>
            )}
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

          <button
            className="checkout-btn"
            onClick={handleSubmitPayment}
            disabled={loading || !paymentUTR.trim()}
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
