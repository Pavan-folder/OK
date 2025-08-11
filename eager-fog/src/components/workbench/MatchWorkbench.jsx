import React, { useState } from "react";
import BuyerCard from "../buyers/BuyerCard";
import SellerProfile from "../sellers/SellerProfile";

export default function MatchWorkbench({ buyers = [], seller = null }) {
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const handleSelectBuyer = (buyer) => {
    setSelectedBuyer(buyer);
  };

  // Optional: Handler for Match action, just a placeholder for now
  const handleMatch = (buyer) => {
    alert(`Matched with ${buyer.name}!`);
    setSelectedBuyer(buyer);
  };

  const handleViewProfile = (buyer) => {
    setSelectedBuyer(buyer);
  };

  return (
    <div className="match-workbench flex flex-col md:flex-row p-4 gap-6 min-h-[500px]">
      {/* Buyers List */}
      <div className="buyers-list flex-1 space-y-4 overflow-y-auto border p-4 rounded-lg bg-white shadow-sm max-h-[600px]">
        <h2 className="text-xl font-semibold mb-4">Potential Buyers</h2>
        {buyers.length > 0 ? (
          buyers.map((buyer) => (
            <BuyerCard
              key={buyer.id}
              buyer={buyer}
              onViewProfile={handleViewProfile}
              onMatch={handleMatch}
            />
          ))
        ) : (
          <p className="text-gray-500">No buyers available</p>
        )}
      </div>

      {/* Seller & Match Details */}
      <div className="seller-details flex-1 space-y-6 border p-6 rounded-lg bg-white shadow-sm">
        {selectedBuyer ? (
          <>
            <SellerProfile seller={seller} />
            <div className="match-score mt-4 p-4 bg-blue-50 border border-blue-300 rounded text-blue-700 font-semibold">
              Match Score with <strong>{selectedBuyer.name}</strong>:{" "}
              <span className="text-blue-800 text-lg font-bold">
                {selectedBuyer.matchScore ?? "N/A"}%
              </span>
            </div>
            <div className="actions mt-6 flex gap-4">
              <button className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition">
                Start Chat
              </button>
              <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
                Send Proposal
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic text-center mt-20">
            Select a buyer from the list to view match details.
          </p>
        )}
      </div>
    </div>
  );
}
