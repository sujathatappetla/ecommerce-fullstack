
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import "../styles/Pages.css";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If cart empty 
  if (items.length === 0) {
    return (
      <div className="page-container">
        <h1 className="page-title">Checkout</h1>
        <p className="muted-text">🛒 Your cart is empty.</p>
      </div>
    );
  }

  // Input handler
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit Order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const orderPayload = {
        items: items.map((i) => ({
          product: i.productId,
          size: i.size,
          qty: i.qty ?? i.quantity,
        })),
        shippingInfo: form,
      };

      const res = await api.post("/api/orders", orderPayload, {
        withCredentials: true,
      });

      clearCart();
      navigate("/order-success", { state: { orderId: res.data.order?._id } });

    } catch (err) {
      const backendMsg = err.response?.data?.message;

     
      setErrorMsg(backendMsg || "❌ Something went wrong. Please try again.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Checkout</h1>

      {errorMsg && (
        <div
          style={{
            background: "#ffe6e6",
            border: "1px solid red",
            padding: "12px",
            borderRadius: "6px",
            color: "red",
            fontWeight: 600,
            marginBottom: "15px",
          }}
        >
          ⚠ {errorMsg}
        </div>
      )}

      <div className="checkout-layout">
        
        {/* Shipping Details Form*/}
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Shipping Details</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>ZIP Code</label>
              <input name="zip" value={form.zip} onChange={handleChange} required />
            </div>
          </div>

          <button className="btn-primary full-width" type="submit" disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <ul>
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`}>
                {i.name} ({i.size}) × {i.qty ?? i.quantity}
              </li>
            ))}
          </ul>

          <p className="checkout-total">
            <strong>Total: ₹{totalPrice.toFixed(2)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
