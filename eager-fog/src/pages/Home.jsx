import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import BuyerCard from "../components/buyers/BuyerCard";
import SellerProfile from "../components/sellers/SellerProfile";
import { sampleBuyers } from "../data/sampleBuyers";
import { sampleSellers } from "../data/sampleSellers";

export default function Home() {
  // Preview a few buyers and sellers (show first 3)
  const featuredBuyers = sampleBuyers.slice(0, 3);
  const featuredSellers = sampleSellers.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to DealMatch
        </h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6">
          Connecting verified buyers and sellers to close deals faster and
          smarter.
        </p>
        <div className="flex justify-center gap-6">
          <Link to="/buyers">
            <Button size="lg">Browse Buyers</Button>
          </Link>
          <Link to="/sellers">
            <Button size="lg" variant="secondary">
              Browse Sellers
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div>
          <h2 className="text-3xl font-bold text-blue-600">120+</h2>
          <p className="text-gray-600">Verified Buyers</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-green-600">85+</h2>
          <p className="text-gray-600">Trusted Sellers</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-purple-600">500+</h2>
          <p className="text-gray-600">Deals Closed</p>
        </div>
      </section>

      {/* Featured Buyers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Buyers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBuyers.map((buyer) => (
            <BuyerCard key={buyer.id} buyer={buyer} />
          ))}
        </div>
      </section>

      {/* Featured Sellers */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Sellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSellers.map((seller) => (
            <SellerProfile key={seller.id} seller={seller} />
          ))}
        </div>
      </section>

      {/* Testimonials (Placeholder) */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          What Our Users Say
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <blockquote className="italic text-gray-700">
            "DealMatch helped us find the perfect buyer quickly. The process was
            smooth and transparent."
            <footer className="mt-2 text-right font-semibold">- R. Kumar</footer>
          </blockquote>
          <blockquote className="italic text-gray-700">
            "A trustworthy platform that connects serious sellers with
            investors. Highly recommend!"
            <footer className="mt-2 text-right font-semibold">- S. Mehta</footer>
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t mt-12">
        © {new Date().getFullYear()} DealMatch. All rights reserved.
      </footer>
    </div>
  );
}
