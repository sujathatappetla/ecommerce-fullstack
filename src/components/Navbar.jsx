
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          ShopSmart
        </Link>
      </div>
      <button
        className="navbar-toggle"
        onClick={() => {
          document
            .querySelector(".navbar-links")
            .classList.toggle("navbar-links-open");
        }}
      >
        ☰
      </button>
      <div className="navbar-links">
        <Link
          to="/"
          className={location.pathname === "/" ? "active-link" : ""}
        >
          Home
        </Link>
        <Link
          to="/products"
          className={location.pathname.startsWith("/products") ? "active-link" : ""}
        >
          Products
        </Link>
        <Link
          to="/cart"
          className={location.pathname === "/cart" ? "active-link" : ""}
        >
          Cart ({totalItems})
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-user">Hi, {user.name}</span>
            <button className="btn-secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
