import React, { useState } from "react";
import MatchWorkbench from "../components/workbench/MatchWorkbench";
import { sampleBuyers } from "../data/sampleBuyers";
import { sampleSellers } from "../data/sampleSellers";

export default function Workbench() {
  // State to hold the selected seller
  const [selectedSeller, setSelectedSeller] = useState(sampleSellers[0] || null);

  // Optional: Handler to change seller, for demo purpose
  const handleSellerChange = (event) => {
    const sellerId = parseInt(event.target.value, 10);
    const seller = sampleSellers.find((s) => s.id === sellerId) || null;
    setSelectedSeller(seller);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Deal Match Workbench</h1>

      {/* Seller Selector */}
      <div className="mb-6">
        <label htmlFor="seller-select" className="block mb-2 font-medium text-gray-700">
          Select Seller
        </label>
        <select
          id="seller-select"
          value={selectedSeller?.id || ""}
          onChange={handleSellerChange}
          className="border rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sampleSellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {seller.name}
            </option>
          ))}
        </select>
      </div>

      {/* Match Workbench Component */}
      <MatchWorkbench buyers={sampleBuyers} seller={selectedSeller} />
      
      {/* Optional footer or additional tools could be added here */}

    </div>
  );
}
