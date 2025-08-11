import React from "react";
import BuyerCard from "../components/buyers/BuyerCard";
import SellerProfile from "../components/sellers/SellerProfile";
import { sampleBuyers } from "../data/sampleBuyers";
import { sampleSellers } from "../data/sampleSellers";

export default function Matches() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Matches</h1>
      <p className="mb-8 text-gray-600">
        Explore potential matches between verified buyers and sellers curated
        for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Buyers Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold mb-2 border-b pb-1">Potential Buyers</h2>
          <p className="text-sm text-gray-500 mb-4">
            Buyers actively looking for deals that match your selling profile.
          </p>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {sampleBuyers.slice(0, 3).map((buyer) => (
              <BuyerCard key={buyer.id} buyer={buyer} />
            ))}
          </div>
        </section>

        {/* Sellers Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold mb-2 border-b pb-1">Potential Sellers</h2>
          <p className="text-sm text-gray-500 mb-4">
            Sellers with products and offerings matching buyer interests.
          </p>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {sampleSellers.slice(0, 3).map((seller) => (
              <SellerProfile key={seller.id} seller={seller} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
