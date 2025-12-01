
import React from "react";
import "../styles/CartItem.css";

const CartItem = ({ item, onUpdate, onRemove }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-left">
        <img src={item.image} className="cart-item-image" alt={item.name} />

        <div>
          <h4>{item.name}</h4>
          <p>Size: {item.size}</p>
          <strong>₹{item.price}</strong>
        </div>
      </div>

      <div className="cart-item-right">
        <input
          type="number"
          min="1"
          value={item.qty}
          onChange={(e) => onUpdate(Number(e.target.value))}
          className="cart-item-qty"
        />

        <p>₹{(item.qty * item.price).toFixed(2)}</p>

        <button
          className="btn-secondary"
          onClick={() => onRemove(item.productId, item.size)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
