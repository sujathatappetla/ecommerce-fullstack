// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import "../styles/Pages.css";

const DEFAULT_FILTERS = {
  search: "",
  category: "",
  size: "",
  minPrice: "",
  maxPrice: "",
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    const initial = { ...DEFAULT_FILTERS };
    ["search", "category", "size", "minPrice", "maxPrice"].forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) initial[key] = value;
    });
    setFilters(initial);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
        };

        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.size) params.size = filters.size;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;

        const res = await api.get("/api/products", { params });
        setProducts(res.data.products || []);
        setPageInfo({
          page: res.data.page || currentPage,
          totalPages: res.data.totalPages || 1,
        });
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters) => {
    const params = {};
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    params.page = 1;
    setSearchParams(params);
  };

  const changePage = (newPage) => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    params.page = newPage;
    setSearchParams(params);
  };

  return (
    <div className="page-container">
      <div className="products-layout">
        <aside className="sidebar">
          <h2 className="sidebar-title">Filters</h2>
          <Filters filters={filters} onChange={handleFilterChange} />
        </aside>
        <main className="products-main">
          <h1 className="page-title">All Products</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="products-grid">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
                {products.length === 0 && (
                  <p className="muted-text">
                    No products found for selected filters.
                  </p>
                )}
              </div>
              <div className="pagination">
                <button
                  className="btn-secondary"
                  disabled={pageInfo.page <= 1}
                  onClick={() => changePage(pageInfo.page - 1)}
                >
                  Prev
                </button>
                <span>
                  Page {pageInfo.page} of {pageInfo.totalPages}
                </span>
                <button
                  className="btn-secondary"
                  disabled={pageInfo.page >= pageInfo.totalPages}
                  onClick={() => changePage(pageInfo.page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
