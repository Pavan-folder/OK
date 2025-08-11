// src/pages/SellerProfile.jsx
import React from "react";
// Optional for custom styles

const SellerProfile = ({ seller }) => {
  if (!seller) {
    return <p>No seller data available.</p>;
  }

  return (
    <div className="seller-profile-container">
      {/* Seller Header */}
      <div className="seller-header">
        <img
          src={seller.logo || "https://via.placeholder.com/100"}
          alt={`${seller.name} logo`}
          className="seller-logo"
        />
        <div className="seller-info">
          <h2>{seller.name}</h2>
          <p>{seller.location}</p>
          <span className="seller-rating">⭐ {seller.rating || "N/A"}</span>
        </div>
      </div>

      {/* Seller Details */}
      <div className="seller-details">
        <h3>About</h3>
        <p>{seller.description || "No description provided."}</p>

        
        

        <h3>Contact</h3>
        <p>Email: {seller.contactEmail || "Not available"}</p>
        <p>Phone: {seller.contactPhone || "Not available"}</p>
      </div>
    </div>
  );
};

export default SellerProfile;
