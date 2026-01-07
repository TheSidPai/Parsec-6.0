import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchMerch();
    loadCart();
  }, []);

  useEffect(() => {
    filterMerch();
  }, [filter, merch]);

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

      // STEP 1: Load admin-added items from localStorage
      const adminItems = localStorage.getItem('admin_store_items');
      const localItems = adminItems ? JSON.parse(adminItems) : [];
      
      // Convert admin items to backend format (id -> _id, filter available only)
      const formattedLocalItems = localItems
        .filter(item => item.available !== false)
        .map(item => ({
          _id: `local_${item.id}`,
          type: item.category,
          name: item.name,
          description: item.description,
          price: item.price,
          stockQuantity: 999, // Assume unlimited for local items
          imageUrl: item.imageUrl,
          sizesAvailable: item.category === 'wearable' ? ['S', 'M', 'L', 'XL'] : []
        }));

      // STEP 2: Try to fetch from backend
      try {
        const { response, data } = await authenticatedFetch(
          API_ENDPOINTS.MERCH_GET_ALL,
          { method: 'GET' },
          token
        );

        console.log('🔍 Shop API Response:', { response, data });
        console.log('🔍 Response status:', response.status);

        // API returns { status: "success", data: { merch: [...] } }
        if (response.ok && data?.status === 'success' && data?.data?.merch) {
          const backendItems = data.data.merch;
          
          console.log('✅ Loaded items from backend:', backendItems);
          console.log('📦 Backend items:', backendItems.length);
          console.log('📦 Admin items:', formattedLocalItems.length);
          
          // Combine backend items + admin items
          const allItems = [...backendItems, ...formattedLocalItems];
          
          console.log('📦 Total items:', allItems.length);
          allItems.forEach(item => {
            console.log(`   - ${item.name} (type: ${item.type})`);
          });
          
          setMerch(allItems);
          setFilteredMerch(allItems);
        } else {
          // No backend items, use only local items
          console.warn('⚠️ No backend items, using admin items only');
          setMerch(formattedLocalItems);
          setFilteredMerch(formattedLocalItems);
        }
      } catch (apiError) {
        // API failed, use only local items
        console.error('⚠️ API error, using admin items only:', apiError);
        setMerch(formattedLocalItems);
        setFilteredMerch(formattedLocalItems);
      }
    } catch (err) {
      console.error('Error in fetchMerch:', err);
      setError('Unable to load shop items');
    } finally {
      setLoading(false);
    }
  };

  const filterMerch = () => {
    if (filter === 'all') {
      setFilteredMerch(merch);
    } else if (filter === 'passes') {
      // Show all pass types
      setFilteredMerch(merch.filter(item => 
        item.type === 'pass' || 
        item.type === 'event-pass1' || 
        item.type === 'event-pass2' || 
        item.type === 'event-pass3'
      ));
    } else {
      setFilteredMerch(merch.filter(item => item.type === filter));
    }
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
      <div className="shop-header" style={{ position: 'relative', zIndex: 1 }}>
        <div className="shop-title-section">
          <h1 className="shop-title">🛍️ Parsec Merchandise Shop</h1>
          <p className="shop-subtitle">
            Official Parsec merch & event passes
          </p>
        </div>
        <button 
          className="shop-cart-btn"
          onClick={() => navigate('/dashboard/cart')}
        >
          🛒 Cart ({getCartItemCount()})
        </button>
      </div>

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
                {/* Badge */}
                <div className="shop-card-badge">
                  {getMerchIcon(item.type)}
                </div>

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
                  <h3 className="shop-card-title">{item.name}</h3>
                  <p className="shop-card-description">{item.description}</p>

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
                    <div className={`shop-card-stock ${item.stockQuantity === 0 ? 'out-of-stock' : ''}`}>
                      {item.stockQuantity > 0 ? (
                        <span>✅ {item.stockQuantity} in stock</span>
                      ) : (
                        <span>❌ Out of stock</span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="shop-add-btn"
                    onClick={() => addToCart(item)}
                    disabled={item.stockQuantity === 0}
                  >
                    {item.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Shop;
