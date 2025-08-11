// src/components/BuyerFilters.jsx
import React, { useState } from "react";

const BuyerFilters = ({ onFilterChange }) => {
  const [industry, setIndustry] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [location, setLocation] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleFilterChange = (field, value) => {
    const newFilters = {
      industry,
      budgetRange,
      location,
      verifiedOnly,
      [field]: value,
    };
    // Update local state
    if (field === "industry") setIndustry(value);
    if (field === "budgetRange") setBudgetRange(value);
    if (field === "location") setLocation(value);
    if (field === "verifiedOnly") setVerifiedOnly(value);

    // Pass updated filters to parent
    onFilterChange && onFilterChange(newFilters);
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold mb-3">Filters</h2>

      {/* Industry */}
      <label className="block mb-2">
        <span className="text-sm font-medium">Industry</span>
        <select
          value={industry}
          onChange={(e) => handleFilterChange("industry", e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="">All</option>
          <option value="tech">Tech</option>
          <option value="fashion">Fashion</option>
          <option value="food">Food & Beverages</option>
        </select>
      </label>

      {/* Budget */}
      <label className="block mb-2">
        <span className="text-sm font-medium">Budget Range</span>
        <select
          value={budgetRange}
          onChange={(e) => handleFilterChange("budgetRange", e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="">Any</option>
          <option value="0-1000">$0 - $1,000</option>
          <option value="1000-5000">$1,000 - $5,000</option>
          <option value="5000+">$5,000+</option>
        </select>
      </label>

      {/* Location */}
      <label className="block mb-2">
        <span className="text-sm font-medium">Location</span>
        <input
          type="text"
          value={location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          placeholder="Enter city or country"
        />
      </label>

      {/* Verified Only */}
      <label className="flex items-center mt-2">
        <input
          type="checkbox"
          checked={verifiedOnly}
          onChange={(e) => handleFilterChange("verifiedOnly", e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm">Verified Buyers Only</span>
      </label>
    </div>
  );
};

export default BuyerFilters;
