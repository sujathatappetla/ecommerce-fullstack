
import React, { useState, useEffect } from "react";
import "../styles/Filters.css";

const Filters = ({ filters, onChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...localFilters, [name]: value };
    setLocalFilters(updated);
  };

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleReset = () => {
    const reset = {
      search: "",
      category: "",
      size: "",
      minPrice: "",
      maxPrice: "",
    };
    setLocalFilters(reset);
    onChange(reset);
  };

  return (
    <div className="filters-container">
      <div className="filters-row">
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          value={localFilters.search}
          onChange={handleInputChange}
        />
      </div>
      <div className="filters-row">
        <select
          name="category"
          value={localFilters.category}
          onChange={handleInputChange}
        >
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>

        <select
          name="size"
          value={localFilters.size}
          onChange={handleInputChange}
        >
          <option value="">All Sizes</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      <div className="filters-row">
        <input
          type="number"
          name="minPrice"
          placeholder="Min price"
          value={localFilters.minPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max price"
          value={localFilters.maxPrice}
          onChange={handleInputChange}
        />
      </div>

      <div className="filters-actions">
        <button className="btn-secondary" onClick={handleReset}>
          Reset
        </button>
        <button className="btn-primary" onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default Filters;
