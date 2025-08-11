// src/components/BuyerProfileModal.jsx
import React from "react";

export default function BuyerProfileModal({ isOpen, onClose, buyer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        {/* Buyer Info */}
        <div className="text-center">
          <img
            src={buyer.avatar}
            alt={buyer.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-gray-200"
          />
          <h2 className="text-2xl font-semibold mt-3">{buyer.name}</h2>
          <p className="text-gray-600">{buyer.company}</p>
        </div>

        {/* Details */}
        <div className="mt-5 space-y-2 text-gray-700">
          <p>
            <strong>Location:</strong> {buyer.location}
          </p>
          <p>
            <strong>Industry:</strong> {buyer.industry}
          </p>
          <p>
            <strong>Budget:</strong> {buyer.budget}
          </p>
          <p>
            <strong>Requirements:</strong> {buyer.requirements}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => alert("Message sent!")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Message Buyer
          </button>
        </div>
      </div>
    </div>
  );
}
