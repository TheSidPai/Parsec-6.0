import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import Particles from '../../components/Particles';
import './Shop.css';

function Shop() {
  const [merch, setMerch] = useState([]);
  const [filteredMerch, setFilteredMerch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const filterMerch = useCallback(() => {
    console.log('🔍 Filtering with filter:', filter);
    console.log('🔍 Total merch items:', merch.length);
    
    if (filter === 'all') {
      setFilteredMerch(merch);
    } else if (filter === 'passes') {
      // Event passes - check for event-pass1 and event-pass2 types
      const filtered = merch.filter(item => {
        const isPass = item.type === 'event-pass1' || 
                      item.type === 'event-pass2' || 
                      item.type === 'pass' || 
                      item.type === 'event-pass' ||
                      item.category === 'passes' || 
                      item.category === 'pass' || 
                      item.category === 'event-pass';
        console.log(`   ${item.name}: type="${item.type}", category="${item.category}", isPass=${isPass}`);
        return isPass;
      });
      console.log('✅ Filtered passes:', filtered.length);
      setFilteredMerch(filtered);
    } else if (filter === 'non-wearable') {
      // Accessories/non-wearables
      setFilteredMerch(merch.filter(item => 
        item.category === 'non-wearable' || item.category === 'accessory' ||
        item.type === 'accessory' || item.type === 'non-wearable'
      ));
    } else if (filter === 'wearable') {
      setFilteredMerch(merch.filter(item => 
        item.category === 'wearable' || item.type === 'wearable'
      ));
    } else {
      setFilteredMerch(merch.filter(item => 
        item.type === filter || item.category === filter
      ));
    }
  }, [filter, merch]);

  useEffect(() => {
    fetchMerch();
    loadCart();
  }, []);

  useEffect(() => {
    filterMerch();
  }, [filter, merch, filterMerch]);

  const loadCart = () => {
    const savedCart = localStorage.getItem('parsec_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const fetchMerch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt_token');

      // Fetch ONLY from backend (no localStorage)
      try {
        const { response, data } = await authenticatedFetch(
          API_ENDPOINTS.MERCH_GET_ALL,
          { method: 'GET' },
          token
        );

        console.log('🔍 Shop API Response:', { response, data });
        console.log('🔍 Response status:', response.status);

        // Handle both response formats:
        // Format 1: { status: "success", data: { merch: [...] } }
        // Format 2: { success: true, data: [...] }
        let backendItems = [];
        
        if (response.ok && (data?.status === 'success' || data?.success === true)) {
          // Try different data structures
          if (data?.data?.merch) {
            backendItems = data.data.merch;
          } else if (Array.isArray(data?.data)) {
            backendItems = data.data;
          } else if (data?.data?.body) {
            backendItems = data.data.body;
          }
          
          console.log('✅ Loaded items from backend:', backendItems);
          console.log('📦 Backend items:', backendItems.length);
          
          backendItems.forEach(item => {
            console.log(`   - ${item.name} (Type: ${item.type}, Category: ${item.category}, Stock: ${item.stockQuantity || item.stock})`);
          });
          
          setMerch(backendItems);
          setFilteredMerch(backendItems);
        } else {
          console.warn('⚠️ No items found from backend');
          setMerch([]);
          setFilteredMerch([]);
        }
      } catch (apiError) {
        console.error('⚠️ API error:', apiError);
        setError('Unable to load items from server');
        setMerch([]);
        setFilteredMerch([]);
      }
    } catch (err) {
      console.error('Error in fetchMerch:', err);
      setError('Unable to load shop items');
    } finally {
      setLoading(false);
    }
  };

  // Format item names for better display (especially Day Passes)
  const formatItemName = (name, type) => {
    // Handle Day Pass variations
    if (type === 'event-pass1' || type === 'event-pass2') {
      // Extract day number if present
      const dayMatch = name.match(/(\d+)/);
      if (dayMatch) {
        return `Day ${dayMatch[1]} Pass`;
      }
      // If type is event-pass1, it's Day 1
      if (type === 'event-pass1') return 'Day 1 Pass';
      // If type is event-pass2, it's Day 2
      if (type === 'event-pass2') return 'Day 2 Pass';
    }
    
    // Return original name for other items
    return name;
  };

  // Get dates for event passes
  const getPassDates = (type) => {
    if (type === 'event-pass1') return '24th, 26th Jan';
    if (type === 'event-pass2') return '25th, 27th Jan';
    return null;
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      newCart = [...cart, { ...item, quantity: 1, selectedSize: item.sizesAvailable?.[0] || 'N/A' }];
    }

    setCart(newCart);
    localStorage.setItem('parsec_cart', JSON.stringify(newCart));
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="cart-notification-content">
        <span class="cart-notification-icon">✓</span>
        <span class="cart-notification-text">Added to cart!</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getMerchIcon = (type) => {
    switch (type) {
      case 'wearable': return '👕';
      case 'non-wearable': return '🎁';
      case 'event-pass1': return '🎫';
      case 'event-pass2': return '🎫';
      case 'event-pass3': return '🎫';
      case 'pass': return '🎫';
      default: return '🛍️';
    }
  };

  if (loading) {
    return (
      <div className="shop-container">
        <div className="shop-loader">
          <div className="magical-spinner"></div>
          <p>Loading Magical Items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <div className="shop-error">
          <h2>⚠️ {error}</h2>
          <button onClick={fetchMerch} className="shop-retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      {/* Particles Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={600}
          particleSpread={15}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Header */}
      {/* <div className="shop-header" style={{ position: 'relative', zIndex: 1 }}> */}
        <div className="shop-title-section">
          <h1 className="page-title">Merchandise Shop</h1>
          <p className="shop-subtitle">
            Official Parsec merch & event passes
          </p>
          <button 
            className="shop-cart-btn"
            onClick={() => navigate('/dashboard/cart')}
          >
            🛒 CART ({getCartItemCount()})
          </button>
        </div>
      {/* </div> */}

      {/* Filters */}
      <div className="shop-filters" style={{ position: 'relative', zIndex: 1 }}>
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Items
        </button>
        <button 
          className={`filter-btn ${filter === 'wearable' ? 'active' : ''}`}
          onClick={() => setFilter('wearable')}
        >
          Wearables
        </button>
        <button 
          className={`filter-btn ${filter === 'non-wearable' ? 'active' : ''}`}
          onClick={() => setFilter('non-wearable')}
        >
          Accessories
        </button>
        <button 
          className={`filter-btn ${filter === 'passes' ? 'active' : ''}`}
          onClick={() => setFilter('passes')}
        >
          Event Passes
        </button>
      </div>

      {/* Important Notice for Passes */}
      {filter === 'passes' && (
        <div className="shop-important-notice" style={{ position: 'relative', zIndex: 1 }}>
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <h3>Important Notice</h3>
            <p>
              <strong>You CANNOT purchase passes for someone else.</strong> Each person must register their own account and purchase their own pass. 
              This applies to all participants, whether they are part of a team or not. Passes are non-transferable and linked to your registered account.
            </p>
          </div>
        </div>
      )}

      {/* Merch Grid */}
      <div className="shop-grid" style={{ position: 'relative', zIndex: 1 }}>
        {filteredMerch.length === 0 ? (
          <div className="shop-empty">
            <p>No items found in this category</p>
          </div>
        ) : (
          filteredMerch.map((item) => (
            <div key={item._id} className="shop-card">
              <div className="shop-card-inner">
                

                {/* Image */}
                <div className="shop-card-image">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <div className="shop-card-placeholder">
                      {getMerchIcon(item.type)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="shop-card-content">
                  <h3 className="shop-card-title">
                    {/* {formatItemName(item.name, item.type)} */}
                    {item.name}
                  </h3>
                  
                  {/* Pass Dates */}
                  {getPassDates(item.type) && (
                    <div className="shop-card-dates">
                      📅 Valid on: <strong>{getPassDates(item.type)}</strong>
                    </div>
                  )}
                  
                  <div 
                    className="shop-card-description" 
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />

                  {/* Sizes */}
                  {item.sizesAvailable && item.sizesAvailable.length > 0 && (
                    <div className="shop-card-sizes">
                      <span className="sizes-label">Sizes:</span>
                      {item.sizesAvailable.map(size => (
                        <span key={size} className="size-badge">{size}</span>
                      ))}
                    </div>
                  )}

                  {/* Price & Stock */}
                  <div className="shop-card-footer">
                    <div className="shop-card-price">
                      ₹{item.price}
                    </div>
                    <div className={`shop-card-stock ${(item.stockQuantity === 0 || item.stock === 0) ? 'out-of-stock' : ''}`}>
                      {(item.stockQuantity > 0 || item.stock > 0) ? (
                        <span>✅ {item.stockQuantity || item.stock} in stock</span>
                      ) : (
                        <span>❌ Out of stock</span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className=" shop-leather-span"
                    onClick={() => addToCart(item)}
                    disabled={item.stockQuantity === 0 || item.stock === 0}
                  >
                    {(item.stockQuantity === 0 || item.stock === 0) ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredMerch.map((item) => {
  console.log(item.name, item.type); // Add this line
  // ...rest of your code
})}
    </div>
    
  );
}

export default Shop;
