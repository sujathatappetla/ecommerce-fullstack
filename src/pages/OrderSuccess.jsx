
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Pages.css";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="page-container centered-page">
      <h1>Thank you for your order! 🎉</h1>
      {orderId && <p>Your Order ID: {orderId}</p>}
      <p>We’ve sent a confirmation email with your order details.</p>
      <div className="order-success-actions">
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
