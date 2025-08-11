import React, { useState } from "react";

// BuyerCard Component
function BuyerCard({ buyer, onViewProfile, onMatch }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 hover:shadow-lg transition duration-200 max-w-md">
      {/* Buyer Name & Company */}
      <div>
        <h2 className="text-lg font-bold text-gray-800">{buyer.name}</h2>
        <p className="text-sm text-gray-500">{buyer.company}</p>
      </div>

      {/* Buyer Needs */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Needs:</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{buyer.needs}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {(buyer.tags ?? []).map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-auto">
        <button
          onClick={() => onViewProfile(buyer)}
          className="text-blue-600 text-sm hover:underline"
        >
          View Profile
        </button>
        <button
          onClick={() => onMatch(buyer)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Match
        </button>
      </div>
    </div>
  );
}

// Parent component that uses BuyerCard
export default function BuyerCardExample() {
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const buyer = {
    name: "John Doe",
    company: "Acme Corp",
    needs: "Looking for bulk electronic supplies",
    tags: ["electronics", "bulk", "wholesale"],
  };

  // Handler for "View Profile"
  const handleViewProfile = (buyer) => {
    setSelectedBuyer(buyer);
    alert(`Viewing profile of ${buyer.name}`);
  };

  // Handler for "Match"
  const handleMatch = (buyer) => {
    alert(`Match requested with ${buyer.name} from ${buyer.company}`);
  };

  return (
    <div className="p-6">
      <BuyerCard
        buyer={buyer}
        onViewProfile={handleViewProfile}
        onMatch={handleMatch}
      />

      {selectedBuyer && (
        <div className="mt-6 p-4 border rounded bg-gray-100 max-w-md">
          <h3 className="font-bold mb-2">Selected Buyer Profile</h3>
          <p>
            <strong>Name:</strong> {selectedBuyer.name}
          </p>
          <p>
            <strong>Company:</strong> {selectedBuyer.company}
          </p>
          <p>
            <strong>Needs:</strong> {selectedBuyer.needs}
          </p>
          <button
            onClick={() => setSelectedBuyer(null)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
