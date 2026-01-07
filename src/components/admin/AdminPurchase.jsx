import React, { useState, useEffect } from 'react';
import { RiShoppingCartLine, RiAddLine, RiSubtractLine, RiDeleteBinLine, RiImageAddLine, RiEditLine, RiSaveLine } from '@remixicon/react';
import { API_ENDPOINTS, authenticatedFetch } from '../../config/api';
import './AdminComponents.css';

function AdminPurchase() {
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'pass',
    imageUrl: '',
    available: true
  });

  // Load items from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('admin_store_items');
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Error loading items:', error);
      }
    }
  }, []);

  // Save items to localStorage
  const saveItems = (newItems) => {
    setItems(newItems);
    localStorage.setItem('admin_store_items', JSON.stringify(newItems));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
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

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    const adminToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    if (!adminToken) {
      alert('⚠️ Admin authentication required. Please login again.');
      return;
    }

    try {
      // Prepare data for backend API
      const apiData = {
        name: formData.name,
        description: formData.description,
        type: formData.category, // backend uses 'type' instead of 'category'
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        stockQuantity: 999, // Default high stock
        sizesAvailable: formData.category === 'wearable' ? ['S', 'M', 'L', 'XL'] : []
      };

      if (editingItem && editingItem._id && !editingItem._id.startsWith('local_')) {
        // Update existing backend item (TODO: backend endpoint needed)
        alert('⚠️ Update functionality requires backend endpoint. Saving to localStorage only.');
        const newItem = {
          ...editingItem,
          ...formData,
          price: parseFloat(formData.price),
          updatedAt: new Date().toISOString()
        };
        const updatedItems = items.map(item => 
          item.id === editingItem.id ? newItem : item
        );
        saveItems(updatedItems);
      } else {
        // Add new item to backend
        const { response, data } = await authenticatedFetch(
          API_ENDPOINTS.MERCH_ADD,
          {
            method: 'POST',
            body: JSON.stringify(apiData)
          },
          adminToken
        );

        if (response.ok && data?.status === 'success' && data?.data?.merch) {
          alert('✅ Item added successfully to store!');
          
          // Also save to localStorage as backup (convert to local format)
          const localItem = {
            id: data.data.merch._id,
            _id: data.data.merch._id,
            name: data.data.merch.name,
            description: data.data.merch.description,
            category: data.data.merch.type,
            price: data.data.merch.price,
            imageUrl: data.data.merch.imageUrl,
            available: true,
            createdAt: new Date().toISOString()
          };
          saveItems([...items, localItem]);
        } else {
          throw new Error(data?.message || 'Failed to add item');
        }
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'pass',
        imageUrl: '',
        available: true
      });
      setShowAddForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error adding item:', error);
      alert(`❌ Failed to add item: ${error.message}. Saving to localStorage only as fallback.`);
      
      // Fallback: Save to localStorage only
      const newItem = {
        id: editingItem ? editingItem.id : Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingItem) {
        const updatedItems = items.map(item => 
          item.id === editingItem.id ? newItem : item
        );
        saveItems(updatedItems);
      } else {
        saveItems([...items, newItem]);
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'pass',
        imageUrl: '',
        available: true
      });
      setShowAddForm(false);
      setEditingItem(null);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      imageUrl: item.imageUrl,
      available: item.available
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      saveItems(updatedItems);
    }
  };

  const toggleAvailability = (id) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    saveItems(updatedItems);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'pass',
      imageUrl: '',
      available: true
    });
  };

  return (
    <div className="admin-section-container">
      <div className="admin-section-title-wrapper">
        <div className="admin-section-icon">
          <RiShoppingCartLine size={32} />
        </div>
        <h2 className="admin-section-main-title">Store Management</h2>
        <p className="admin-section-subtitle">Manage passes, merchandise, and other items</p>
      </div>

      <div className="admin-content-card">
        {/* Add Item Button */}
        {!showAddForm && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <button
              onClick={() => setShowAddForm(true)}
              className="admin-btn admin-btn-primary"
            >
              <RiAddLine size={20} />
              Add New Item
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="admin-store-form-container">
            <h3 className="admin-store-form-title">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row two-col">
                <div className="admin-form-group">
                  <label className="admin-form-label admin-form-label-required">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., 2-Day Pass, Event T-Shirt"
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label admin-form-label-required">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 299"
                    min="0"
                    step="0.01"
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="admin-form-select"
                >
                  <option value="pass">Event Pass</option>
                  <option value="merchandise">Merchandise</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the item, what's included, etc."
                  className="admin-form-textarea"
                  rows="4"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Item Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="admin-form-input"
                />
                <p className="admin-form-help">
                  Upload an image (max 5MB). Supports JPG, PNG, WebP
                </p>
                {formData.imageUrl && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="admin-image-preview"
                    />
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-checkbox-label">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="admin-form-checkbox"
                  />
                  <span>Item is available for purchase</span>
                </label>
              </div>

              <div className="admin-actions">
                <button type="submit" className="admin-btn admin-btn-success">
                  <RiSaveLine size={20} />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items List */}
        {items.length === 0 && !showAddForm ? (
          <div className="admin-empty-state">
            <div className="admin-empty-icon">🛒</div>
            <p className="admin-empty-text">No items added yet</p>
            <p className="admin-empty-subtext">
              Click "Add New Item" to create your first pass or merchandise item
            </p>
          </div>
        ) : (
          <div className="admin-store-items-grid">
            {items.map(item => (
              <div key={item.id} className="admin-store-item-card">
                {item.imageUrl && (
                  <div className="admin-store-item-image">
                    <img src={item.imageUrl} alt={item.name} />
                    {!item.available && (
                      <div className="admin-store-item-overlay">UNAVAILABLE</div>
                    )}
                  </div>
                )}
                
                <div className="admin-store-item-content">
                  <div className="admin-store-item-header">
                    <h4 className="admin-store-item-title">{item.name}</h4>
                    <span className="admin-store-item-category">{item.category}</span>
                  </div>

                  {item.description && (
                    <p className="admin-store-item-description">{item.description}</p>
                  )}

                  <div className="admin-store-item-price">₹{item.price.toFixed(2)}</div>

                  <div className="admin-store-item-actions">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`admin-btn-sm ${item.available ? 'admin-btn-warning' : 'admin-btn-success'}`}
                    >
                      {item.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="admin-btn-icon admin-btn-primary"
                      title="Edit"
                    >
                      <RiEditLine size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="admin-btn-icon admin-btn-danger"
                      title="Delete"
                    >
                      <RiDeleteBinLine size={18} />
                    </button>
                  </div>

                  <div className="admin-store-item-meta">
                    <small>Updated: {new Date(item.updatedAt).toLocaleString()}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="admin-how-to-use" style={{ marginTop: '2rem' }}>
          <h3 className="admin-how-to-title">How this works:</h3>
          <ul className="admin-how-to-list">
            <li className="admin-how-to-item">Add items (passes, merch, etc.) with images and descriptions</li>
            <li className="admin-how-to-item">Items are stored locally and will appear on your frontend store</li>
            <li className="admin-how-to-item">Toggle availability to control what users can purchase</li>
            <li className="admin-how-to-item">Edit or delete items anytime</li>
            <li className="admin-how-to-item">Images are stored as base64 (for demo purposes)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminPurchase;

// function AdminPurchase() {
//   // Load cart from localStorage on component mount
//   const [cart, setCart] = useState(() => {
//     try {
//       const savedCart = localStorage.getItem('admin-esummit-cart');
//       return savedCart ? JSON.parse(savedCart) : [];
//     } catch (error) {
//       console.error('Error loading admin cart from localStorage:', error);
//       return [];
//     }
//   });

//   // Modal states
//   const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
//   const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
//   const [orderSuccessData, setOrderSuccessData] = useState(null);

//   // Pass data - should match the frontend
//   const [passes, setPasses] = useState([]);

//   // Load pass data and availability
//   useEffect(() => {
//     const loadPasses = () => {
//       // Default pass data
//       const defaultPasses = [
//         {
//           id: 1,
//           name: "1 Day Visitor Pass",
//           description: "One day access to all workshops, talks, stalls, events, etc.",
//           price: 100,
//           soldOut: false
//         },
//         {
//           id: 2,
//           name: "2 Days Visitor Pass",
//           description: "Complete access to all the events of E-Summit'25 for both the days",
//           price: 200,
//           soldOut: false
//         },
//         {
//           id: 3,
//           name: "Stay Pass - Basic",
//           description: "Complementary stay and food (3x meals a day: Breakfast, Lunch, Dinner), starter kit. Stay includes: 8 AM, 23rd August 2025 to 10 AM, 25th August 2025. Anything beyond or before that would be charged extra as applicable.",
//           price: 699,
//           soldOut: false
//         },
//         {
//           id: 4,
//           name: "Stay Pass - Premium",
//           description: "Complementary stay and food (3x meals a day: Breakfast, Lunch, Dinner), starter kit, exclusive E-Summit swags. Stay includes: 8 AM, 23rd August 2025 to 10 AM, 25th August 2025. Anything beyond or before that would be charged extra as applicable.",
//           price: 999,
//           soldOut: false
//         }
//       ];

//       try {
//         // Check for admin-controlled availability
//         const adminPassData = localStorage.getItem('esummit_pass_availability');
//         if (adminPassData) {
//           const adminPasses = JSON.parse(adminPassData);
//           const updatedPasses = defaultPasses.map(pass => {
//             const adminPass = adminPasses.find(ap => ap.id === pass.id);
//             return adminPass ? { ...pass, soldOut: adminPass.soldOut } : pass;
//           });
//           setPasses(updatedPasses);
//         } else {
//           setPasses(defaultPasses);
//         }
//       } catch (error) {
//         console.error('Error loading pass availability:', error);
//         setPasses(defaultPasses);
//       }
//     };

//     loadPasses();

//     // Listen for pass availability updates
//     const handleStorageChange = (e) => {
//       if (e.key === 'esummit_pass_availability') {
//         loadPasses();
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   // Save cart to localStorage whenever cart changes
//   useEffect(() => {
//     try {
//       localStorage.setItem('admin-esummit-cart', JSON.stringify(cart));
//     } catch (error) {
//       console.error('Error saving admin cart to localStorage:', error);
//     }
//   }, [cart]);

//   // Add item to cart
//   const addToCart = (item) => {
//     if (item.soldOut) {
//       alert('This pass is currently sold out');
//       return;
//     }

//     // DoS Protection
//     const MAX_PASSES_PER_ORDER = 5;
//     const currentPasses = cart.reduce((total, cartItem) => total + (cartItem.quantity || 1), 0);
    
//     if (currentPasses >= MAX_PASSES_PER_ORDER) {
//       alert(`Maximum ${MAX_PASSES_PER_ORDER} passes allowed per order. Please remove some passes before adding more.`);
//       return;
//     }

//     // Check if item already exists in cart
//     const existingItem = cart.find(cartItem => cartItem.id === item.id);
//     if (existingItem) {
//       if (currentPasses >= MAX_PASSES_PER_ORDER) {
//         alert(`Maximum ${MAX_PASSES_PER_ORDER} passes allowed per order. Cannot add more passes.`);
//         return;
//       }

//       const updatedCart = cart.map((cartItem) =>
//         cartItem.id === item.id
//           ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
//           : cartItem
//       );
//       setCart(updatedCart);
//     } else {
//       setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
//     }
//   };

//   // Update item quantity
//   const updateItemQuantity = (itemId, newQuantity) => {
//     if (newQuantity <= 0) {
//       const updatedCart = cart.filter(item => item.id !== itemId);
//       setCart(updatedCart);
//     } else {
//       const updatedCart = cart.map(item =>
//         item.id === itemId
//           ? { ...item, quantity: newQuantity }
//           : item
//       );
//       setCart(updatedCart);
//     }
//   };

//   // Remove item from cart
//   const deleteFromCart = (item) => {
//     const updatedCart = cart.filter(cartItem => cartItem.id !== item.id);
//     setCart(updatedCart);
//   };

//   // Clear entire cart
//   const clearCart = () => {
//     setCart([]);
//     localStorage.removeItem('admin-esummit-cart');
//   };

//   // Calculate total price
//   const calculateTotalPrice = () => {
//     return cart.reduce((sum, item) => {
//       const quantity = item.quantity || 1;
//       const price = item.price || 0;
//       return sum + price * quantity;
//     }, 0);
//   };

//   // Handle checkout
//   const handleCheckout = () => {
//     if (cart.length === 0) {
//       alert('Please add some passes to cart before checkout');
//       return;
//     }
//     setCheckoutModalOpen(true);
//   };

//   // Handle order success
//   const handleOrderSuccess = (orderData) => {
//     setOrderSuccessData(orderData);
//     setOrderSuccessModalOpen(true);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-white">Purchase Passes</h2>
//           <p className="text-gray-400">Admin panel pass purchase functionality</p>
//         </div>
        
//         <div className="flex items-center gap-2 text-yellow-400">
//           <RiShoppingCartLine size={20} />
//           <span className="font-semibold">
//             Cart: {cart.reduce((total, item) => total + (item.quantity || 1), 0)} items
//           </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Pass Selection - 2/3 width */}
//         <div className="lg:col-span-2 space-y-4">
//           <h3 className="text-xl font-semibold text-white mb-4">Available Passes</h3>
          
//           {passes.map((pass) => (
//             <div
//               key={pass.id}
//               className={`p-4 rounded-lg border transition-all ${
//                 pass.soldOut
//                   ? 'bg-gray-800 border-gray-600 opacity-60'
//                   : 'bg-[#2e2e2e] border-gray-600 hover:border-yellow-500/50'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h4 className={`text-lg font-semibold ${
//                       pass.soldOut ? 'text-gray-400' : 'text-white'
//                     }`}>
//                       {pass.name}
//                     </h4>
//                     <span className={`text-lg font-bold ${
//                       pass.soldOut ? 'text-gray-400 line-through' : 'text-yellow-400'
//                     }`}>
//                       ₹{pass.price}
//                     </span>
//                     {pass.soldOut && (
//                       <span className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded-full">
//                         SOLD OUT
//                       </span>
//                     )}
//                   </div>
                  
//                   <p className={`text-sm ${
//                     pass.soldOut ? 'text-gray-500' : 'text-gray-300'
//                   } max-w-2xl`}>
//                     {pass.description}
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => addToCart(pass)}
//                   disabled={pass.soldOut}
//                   className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                     pass.soldOut
//                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                       : 'bg-yellow-500 hover:bg-yellow-600 text-black'
//                   }`}
//                 >
//                   {pass.soldOut ? 'Sold Out' : 'Add to Cart'}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Cart - 1/3 width */}
//         <div className="bg-[#2e2e2e] rounded-lg p-4 h-fit">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-white">Shopping Cart</h3>
//             {cart.length > 0 && (
//               <button
//                 onClick={clearCart}
//                 className="text-red-400 hover:text-red-300 text-sm"
//               >
//                 Clear All
//               </button>
//             )}
//           </div>

//           {cart.length === 0 ? (
//             <div className="text-center py-8">
//               <RiShoppingCartLine size={48} className="mx-auto text-gray-600 mb-3" />
//               <p className="text-gray-400">Your cart is empty</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {cart.map((item) => (
//                 <div key={item.id} className="bg-gray-700 rounded-lg p-3">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="text-white font-medium text-sm">{item.name}</h4>
//                     <button
//                       onClick={() => deleteFromCart(item)}
//                       className="text-red-400 hover:text-red-300"
//                     >
//                       <RiDeleteBinLine size={16} />
//                     </button>
//                   </div>
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
//                         className="w-6 h-6 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center justify-center"
//                       >
//                         <RiSubtractLine size={12} />
//                       </button>
//                       <span className="text-white font-medium">{item.quantity || 1}</span>
//                       <button
//                         onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
//                         className="w-6 h-6 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center justify-center"
//                       >
//                         <RiAddLine size={12} />
//                       </button>
//                     </div>
//                     <span className="text-yellow-400 font-bold">
//                       ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               ))}

//               <div className="border-t border-gray-600 pt-3">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-lg font-semibold text-white">Total:</span>
//                   <span className="text-xl font-bold text-yellow-400">
//                     ₹{calculateTotalPrice().toFixed(2)}
//                   </span>
//                 </div>
                
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
//                 >
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       <CheckoutModal
//         isOpen={checkoutModalOpen}
//         onClose={() => setCheckoutModalOpen(false)}
//         cart={cart}
//         totalPrice={calculateTotalPrice()}
//         onOrderComplete={clearCart}
//         onOrderSuccess={handleOrderSuccess}
//       />

//       {/* Order Success Modal */}
//       <OrderSuccessModal
//         isOpen={orderSuccessModalOpen}
//         onClose={() => setOrderSuccessModalOpen(false)}
//         orderData={orderSuccessData}
//       />
//     </div>
//   );
// }

// export default AdminPurchase;
