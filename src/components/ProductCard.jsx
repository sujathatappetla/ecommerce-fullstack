
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div
        className="product-image-wrapper"
        onClick={() => navigate(`/products/${product._id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">₹{product.price}</p>
        <button
          className="btn-primary full-width"
          onClick={() => navigate(`/products/${product._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
