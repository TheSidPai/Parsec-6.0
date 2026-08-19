import React from 'react';
import './PassCheckout.css';

function PassCheckout() {
  // --- Booking/payment logic and UI commented out for closure period ---
  /*
  const location = useLocation();
  const navigate = useNavigate();
  const { pass } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [paymentUTR, setPaymentUTR] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!pass) {
      navigate('/dashboard/passes');
    }
  }, [pass, navigate]);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!paymentUTR.trim()) {
      setError('Please enter a valid UTR number');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Step 1: Create order
      const orderPayload = {
        items: [{
          merchId: pass._id,
          quantity: 1
        }]
      };

      const { response: orderResponse, data: orderData } = await authenticatedFetch(
        API_ENDPOINTS.ORDERS_CREATE,
        {
          method: 'POST',
          body: JSON.stringify(orderPayload)
        }
      );

      if (!orderResponse.ok || orderData.status !== 'success') {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const orderId = orderData.data.order._id;

      // Step 2: Record payment
      const paymentPayload = {
        orderId,
        amount: pass.price,
        paymentUTR: paymentUTR.trim()
      };

      const { response: paymentResponse, data: paymentData } = await authenticatedFetch(
        API_ENDPOINTS.PAYMENTS_SUBMIT,
        {
          method: 'POST',
          body: JSON.stringify(paymentPayload)
        }
      );

      if (!paymentResponse.ok || paymentData.status !== 'success') {
        throw new Error(paymentData.message || 'Failed to record payment');
      }

      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/dashboard/payment-history');
      }, 3000);

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  */

  // --- Show closed message only ---
  return (
    <div className="checkout-page">
      <div className="checkout-closed-message">
        <h1>Passes/Orders Closed</h1>
        <p>All passes and orders for Parsec 2026 are now closed.<br/>Thank you for your interest!</p>
      </div>
    </div>
  );
}

export default PassCheckout;
