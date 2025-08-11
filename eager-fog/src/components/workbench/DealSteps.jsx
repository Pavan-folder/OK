import React from "react";

const steps = [
  { id: 1, label: "Introduced", description: "Buyer and Seller connected" },
  { id: 2, label: "Negotiating", description: "Terms and pricing discussed" },
  { id: 3, label: "Agreement", description: "Contract finalized and signed" },
  { id: 4, label: "Payment", description: "Funds transferred securely" },
  { id: 5, label: "Closed", description: "Deal completed successfully" },
];

export default function DealSteps({ currentStep = 1 }) {
  return (
    <section aria-label="Deal Progress" className="deal-steps-container p-4">
      <h3 className="text-lg font-bold mb-4">Deal Progress</h3>
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => {
          const isActive = step.id <= currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center flex-shrink-0">
                <div
                  aria-current={isCurrent ? "step" : undefined}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm 
                    ${
                      isActive
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-300 text-gray-700"
                    }`}
                >
                  {step.id}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`flex-1 h-1 rounded ${
                    step.id < currentStep
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-5 p-3 bg-green-50 rounded-md text-sm text-green-800 font-medium">
        {steps.find((s) => s.id === currentStep)?.description || ""}
      </div>
    </section>
  );
}
