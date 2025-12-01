// src/pages/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import "../styles/Pages.css";

const Cart = () => {
  const { items, updateItem, removeItem, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 className="page-title">Your Cart</h1>
      {items.length === 0 ? (
        <p className="muted-text">Your cart is empty.</p>
      ) : (
        <div className="cart-page-layout">
          <div className="cart-items-list">
            {items.map((item) => (
              <CartItem
                key={`${item.productId}-${item.size}-${item._id || ""}`}
                item={item}
                onUpdate={(qty) =>
                  updateItem(item._id || item.productId, item.size, qty)
                }
                onRemove={() =>
                  removeItem(item._id || item.productId, item.size)
                }
              />
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <p>Total: ₹{totalPrice.toFixed(2)}</p>
            <button
              className="btn-primary full-width"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
