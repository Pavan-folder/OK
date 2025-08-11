import React, { useState, useMemo } from "react";
import SellerProfile from "../components/sellers/SellerProfile";
import { sampleSellers } from "../data/sampleSellers";

export default function Sellers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  // Get unique industries from sellers for filter dropdown
  const industries = useMemo(() => {
    const allIndustries = sampleSellers.map((s) => s.industry);
    return Array.from(new Set(allIndustries));
  }, []);

  // Filter sellers by search term and industry filter
  const filteredSellers = useMemo(() => {
    return sampleSellers.filter((seller) => {
      const matchesSearch =
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = industryFilter
        ? seller.industry === industryFilter
        : true;
      return matchesSearch && matchesIndustry;
    });
  }, [searchTerm, industryFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Sellers</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="search"
          placeholder="Search sellers by name, location, description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search sellers"
        />

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by industry"
        >
          <option value="">All Industries</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      {/* Seller Cards Grid */}
      {filteredSellers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSellers.map((seller) => (
            <SellerProfile key={seller.id} seller={seller} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-12">
          No sellers found matching your criteria.
        </p>
      )}
    </div>
  );
}
