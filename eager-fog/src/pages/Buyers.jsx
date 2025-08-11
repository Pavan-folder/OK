import React, { useState } from "react";
import BuyerCard from "../components/buyers/BuyerCard";
import BuyerFilters from "../components/buyers/BuyerFilters";
import { sampleBuyers } from "../data/sampleBuyers";

export default function Buyers() {
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterBudget, setFilterBudget] = useState("");

  // Filter buyers based on selected filters
  const filteredBuyers = sampleBuyers.filter((buyer) => {
    const industryMatch = filterIndustry
      ? buyer.industry.toLowerCase().includes(filterIndustry.toLowerCase())
      : true;
    const budgetMatch = filterBudget
      ? buyer.budget.toLowerCase().includes(filterBudget.toLowerCase())
      : true;
    return industryMatch && budgetMatch;
  });

  // Handlers to pass down to BuyerFilters (you'll need to implement BuyerFilters accordingly)
  const handleIndustryChange = (industry) => setFilterIndustry(industry);
  const handleBudgetChange = (budget) => setFilterBudget(budget);

  // Dummy callbacks for BuyerCard actions
  const handleViewProfile = (buyer) => {
    alert(`Viewing profile of ${buyer.name}`);
  };

  const handleMatch = (buyer) => {
    alert(`Match initiated with ${buyer.name}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Buyers</h1>
      <BuyerFilters
        industry={filterIndustry}
        budget={filterBudget}
        onIndustryChange={handleIndustryChange}
        onBudgetChange={handleBudgetChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredBuyers.length > 0 ? (
          filteredBuyers.map((buyer) => (
            <BuyerCard
              key={buyer.id}
              buyer={buyer}
              onViewProfile={handleViewProfile}
              onMatch={handleMatch}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No buyers match your filters.</p>
        )}
      </div>
    </div>
  );
}
