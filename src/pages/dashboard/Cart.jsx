import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('parsec_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('parsec_cart', JSON.stringify(newCart));
  };

  const updateQuantity = (itemId, change) => {
    const newCart = cart.map(item => {
      if (item._id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null;
        if (newQuantity > item.stockQuantity) {
          alert(`Only ${item.stockQuantity} items available in stock`);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);

    saveCart(newCart);
  };

  const updateSize = (itemId, newSize) => {
    const newCart = cart.map(item =>
      item._id === itemId ? { ...item, selectedSize: newSize } : item
    );
    saveCart(newCart);
  };

  const removeItem = (itemId) => {
    const newCart = cart.filter(item => item._id !== itemId);
    saveCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/dashboard/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Start adding some magical items!</p>
          <button 
            className="cart-shop-btn"
            onClick={() => navigate('/dashboard/shop')}
          >
            Browse Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Header */}
      <div className="cart-header">
        <h1 className="cart-title">🛒 Your Shopping Cart</h1>
        <button 
          className="cart-back-btn"
          onClick={() => navigate('/dashboard/shop')}
        >
          ← Continue Shopping
        </button>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="cart-item-placeholder">
                    {item.type === 'wearable' ? '👕' : '🎁'}
                  </div>
                )}
              </div>

              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-description">{item.description}</p>

                {/* Size Selection */}
                {item.sizesAvailable && item.sizesAvailable.length > 0 && (
                  <div className="cart-item-size">
                    <label>Size:</label>
                    <select
                      value={item.selectedSize}
                      onChange={(e) => updateSize(item._id, e.target.value)}
                      className="size-select"
                    >
                      {item.sizesAvailable.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="cart-item-quantity">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="qty-btn"
                    >
                      −
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="qty-btn"
                      disabled={item.quantity >= item.stockQuantity}
                    >
                      +
                    </button>
                  </div>
                  <span className="stock-info">
                    {item.stockQuantity} available
                  </span>
                </div>
              </div>

              <div className="cart-item-actions">
                <div className="cart-item-price">
                  ₹{item.price * item.quantity}
                  {item.quantity > 1 && (
                    <span className="price-unit">
                      (₹{item.price} each)
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="cart-item-remove"
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-row">
            <span>Total Items:</span>
            <span>{getTotalItems()}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{getTotalPrice()}</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row summary-total">
            <span>Total Amount:</span>
            <span>₹{getTotalPrice()}</span>
          </div>

          <button 
            className="cart-checkout-btn"
            onClick={proceedToCheckout}
          >
            Proceed to Checkout →
          </button>

          <button
            className="cart-clear-btn"
            onClick={() => {
              if (window.confirm('Clear entire cart?')) {
                saveCart([]);
              }
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
