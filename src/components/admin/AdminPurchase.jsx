import React from 'react';
import { RiShoppingCartLine } from '@remixicon/react';
import './AdminComponents.css';

function AdminPurchase() {
  return (
    <div className="admin-section-container">
      <div className="admin-section-title-wrapper">
        <div className="admin-section-icon">
          <RiShoppingCartLine size={32} />
        </div>
        <h2 className="admin-section-main-title">Purchase Passes</h2>
        <p className="admin-section-subtitle">Admin pass purchasing functionality</p>
      </div>

      <div className="admin-content-card">
        <div className="admin-empty-state">
          <div className="admin-empty-icon">🛒</div>
          <p className="admin-empty-text">Purchase Pass Feature</p>
          <p className="admin-empty-subtext">This feature allows admins to purchase passes on behalf of users. Coming soon!</p>
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
