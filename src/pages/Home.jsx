
import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/Pages.css";

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/api/products", {
          params: { limit: 4 },
        });
        setFeatured(res.data.products || []);
      } catch (err) {
        console.error("Error fetching featured products", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-text">
          <h1>Shop the Latest Trends</h1>
          <p>Discover premium quality products at the best prices.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Featured Products</h2>
        </div>
        <div className="products-grid">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
          {featured.length === 0 && (
            <p className="muted-text">No featured products found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
