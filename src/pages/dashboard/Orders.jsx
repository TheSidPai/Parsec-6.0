import React, { useState, useEffect } from "react";
import { API_ENDPOINTS, authenticatedFetch } from "../../config/api";
import Particles from "../../components/Particles";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // DEV MODE: Allow orders page to work without token
      if (!token) {
        console.warn("⚠️ DEV MODE: No token - showing empty orders");
        setOrders([]);
        setLoading(false);
        return;
      }

      const { response, data } = await authenticatedFetch(
        API_ENDPOINTS.ORDERS_MY,
        { method: "GET" },
        token
      );

      if (response.ok && data) {
        setOrders(data.orders || []);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { bg: "#ffc107", text: "#000" },
      confirmed: { bg: "#28a745", text: "#fff" },
      shipped: { bg: "#007bff", text: "#fff" },
      delivered: { bg: "#6c757d", text: "#fff" },
      cancelled: { bg: "#dc3545", text: "#fff" },
    };

    const style = statusStyles[status] || statusStyles.pending;

    return (
      <span
        style={{
          background: style.bg,
          color: style.text,
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "0.85rem",
          fontWeight: "600",
          textTransform: "capitalize",
        }}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <h3>{error}</h3>
          <button onClick={fetchOrders} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
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

      <div className="orders-header">
        <h1>🛍️ My Orders</h1>
        <p>Track your merchandise and accommodation orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No orders yet</h3>
            <p>Your orders will appear here once you make a purchase</p>
          </div>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3>Order #{order.orderId || order._id.slice(-8)}</h3>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="order-items">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      {item.size && (
                        <span className="item-size">Size: {item.size}</span>
                      )}
                      {item.quantity && (
                        <span className="item-quantity">
                          Qty: {item.quantity}
                        </span>
                      )}
                    </div>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-total">
                  <span>Total Amount:</span>
                  <strong>₹{order.totalAmount}</strong>
                </div>
                {order.trackingId && (
                  <div className="tracking-info">
                    <span>Tracking: {order.trackingId}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
