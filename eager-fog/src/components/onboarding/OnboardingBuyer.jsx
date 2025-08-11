import React, { useReducer, useEffect, useState } from "react";

// Validation helper
const validateEmail = (email) =>
  /^\S+@\S+\.\S+$/.test(email.trim());

const validatePhone = (phone) =>
  /^\+?[\d\s\-]{7,15}$/.test(phone.trim());

const initialFormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  category: "",
  budget: "",
  notes: "",
  country: "",
  interestedRegions: [],
  productTypes: [],
  acceptTerms: false,
  documents: null,
};

const categories = [
  "Electronics",
  "Fashion",
  "Automotive",
  "Food & Beverage",
  "Home & Garden",
  "Health & Beauty",
];

const countries = [
  "United States",
  "India",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
];

const productTypes = [
  "New",
  "Refurbished",
  "Used",
  "Custom",
];

const steps = [
  "Basic Info",
  "Contact Details",
  "Preferences",
  "Additional Info",
  "Upload Documents",
  "Review & Submit",
];

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "UPDATE_MULTI_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialFormData;
    default:
      return state;
  }
}

export default function OnboardingBuyer({ onComplete }) {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate current step fields
  const validateStep = () => {
    let newErrors = {};

    switch (step) {
      case 0:
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.company.trim()) newErrors.company = "Company is required.";
        break;
      case 1:
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format.";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
        else if (!validatePhone(formData.phone)) newErrors.phone = "Invalid phone number.";
        break;
      case 2:
        if (!formData.category) newErrors.category = "Category is required.";
        if (!formData.budget.trim()) newErrors.budget = "Budget is required.";
        break;
      case 3:
        if (!formData.country) newErrors.country = "Country is required.";
        if (formData.interestedRegions.length === 0) newErrors.interestedRegions = "Select at least one region.";
        if (formData.productTypes.length === 0) newErrors.productTypes = "Select at least one product type.";
        if (!formData.acceptTerms) newErrors.acceptTerms = "You must accept terms and conditions.";
        break;
      case 4:
        if (!formData.documents) newErrors.documents = "Upload at least one document.";
        break;
      default:
        break;
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      dispatch({ type: "UPDATE_FIELD", field: name, value: checked });
    } else if (type === "file") {
      dispatch({ type: "UPDATE_FIELD", field: name, value: files });
    } else {
      dispatch({ type: "UPDATE_FIELD", field: name, value });
    }

    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Multi-select handling
  const handleMultiSelectChange = (name, option) => {
    const current = formData[name];
    let updated;

    if (current.includes(option)) {
      updated = current.filter((item) => item !== option);
    } else {
      updated = [...current, option];
    }

    dispatch({ type: "UPDATE_MULTI_FIELD", field: name, value: updated });
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        // Final submit
        setIsSubmitting(true);
        setTimeout(() => {
          console.log("Buyer Onboarding Data:", formData);
          if (onComplete) onComplete(formData);
          setIsSubmitting(false);
          setStep(0);
          dispatch({ type: "RESET" });
          setTouched({});
          setErrors({});
          alert("Onboarding Complete!");
        }, 1500);
      }
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const isFieldError = (field) => touched[field] && errors[field];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 my-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Buyer Onboarding
      </h2>

      {/* Step progress bar with labels */}
      <ol className="flex justify-between mb-10" aria-label="Progress">
        {steps.map((label, idx) => (
          <li
            key={label}
            className={`flex-1 text-center border-b-4 pb-2 cursor-pointer select-none ${
              idx <= step
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-gray-300 text-gray-400"
            }`}
            onClick={() => {
              if (idx < step) setStep(idx); // allow going back by clicking
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" && idx < step) setStep(idx);
            }}
          >
            {label}
          </li>
        ))}
      </ol>

      {/* Step content */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }}
        noValidate
      >
        {/* Step 0 - Basic Info */}
        {step === 0 && (
          <>
            <div className="mb-6">
              <label htmlFor="name" className="block font-medium mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isFieldError("name")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!isFieldError("name")}
                aria-describedby={isFieldError("name") ? "name-error" : undefined}
                required
              />
              {isFieldError("name") && (
                <p
                  id="name-error"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="company" className="block font-medium mb-1">
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isFieldError("company")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!isFieldError("company")}
                aria-describedby={isFieldError("company") ? "company-error" : undefined}
                required
              />
              {isFieldError("company") && (
                <p
                  id="company-error"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.company}
                </p>
              )}
            </div>
          </>
        )}

        {/* Step 1 - Contact Details */}
        {step === 1 && (
          <>
            <div className="mb-6">
              <label htmlFor="email" className="block font-medium mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isFieldError("email")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!isFieldError("email")}
                aria-describedby={isFieldError("email") ? "email-error" : undefined}
                required
              />
              {isFieldError("email") && (
                <p
                  id="email-error"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block font-medium mb-1">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isFieldError("phone")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!isFieldError("phone")}
                aria-describedby={isFieldError("phone") ? "phone-error" : undefined}
                required
              />
              {isFieldError("phone") && (
                <p
                  id="phone-error"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.phone}
                </p>
              )}
            </div>
          </>
        )}

        {/* Step 2 - Preferences */}
        {step === 2 && (
          <>
            <div className="mb-6">
              <label htmlFor="category" className="block font-medium mb-1">
                Product Category <span className="text-red-600">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isFieldError("category")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!isFieldError("category")}
                aria-describedby={isFieldError("category") ? "category-error" : undefined}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {isFieldError("category") && (
                <p
                  id="category-error"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.category}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="budget" className="block font-medium mb-1">
                Estimated Budget <span className="text-red-600">*</span>
              </label>
              <input
                id="budget"
                name="budget"
                type="text"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="E.g., $1000 - $5000"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isFieldError("budget")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!isFieldError("budget")}
                aria-describedby={isFieldError("budget") ? "budget-error" : undefined}
                required
              />
              {isFieldError("budget") && (
                <p
                  id="budget-error"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.budget}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block font-medium mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special requirements or info"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
              />
            </div>
          </>
        )}

        {/* Step 3 - Additional Info */}
        {step === 3 && (
          <>
            <div className="mb-6">
              <label htmlFor="country" className="block font-medium mb-1">
                Country <span className="text-red-600">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  isFieldError("country")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!isFieldError("country")}
                aria-describedby={isFieldError("country") ? "country-error" : undefined}
                required
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {isFieldError("country") && (
                <p
                  id="country-error"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.country}
                </p>
              )}
            </div>

            <fieldset className="mb-6">
              <legend className="font-medium mb-2">
                Interested Regions <span className="text-red-600">*</span>
              </legend>
              <div className="flex flex-wrap gap-4">
                {countries.map((region) => (
                  <label
                    key={region}
                    className="inline-flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="interestedRegions"
                      checked={formData.interestedRegions.includes(region)}
                      onChange={() => handleMultiSelectChange("interestedRegions", region)}
                      className="cursor-pointer"
                    />
                    {region}
                  </label>
                ))}
              </div>
              {isFieldError("interestedRegions") && (
                <p
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.interestedRegions}
                </p>
              )}
            </fieldset>

            <fieldset className="mb-6">
              <legend className="font-medium mb-2">
                Product Types <span className="text-red-600">*</span>
              </legend>
              <div className="flex flex-wrap gap-4">
                {productTypes.map((type) => (
                  <label
                    key={type}
                    className="inline-flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="productTypes"
                      checked={formData.productTypes.includes(type)}
                      onChange={() => handleMultiSelectChange("productTypes", type)}
                      className="cursor-pointer"
                    />
                    {type}
                  </label>
                ))}
              </div>
              {isFieldError("productTypes") && (
                <p
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.productTypes}
                </p>
              )}
            </fieldset>

            <div className="mb-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="cursor-pointer"
                  required
                  aria-invalid={!!isFieldError("acceptTerms")}
                />
                <span>
                  I accept the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600"
                  >
                    terms and conditions
                  </a>
                  <span className="text-red-600">*</span>
                </span>
              </label>
              {isFieldError("acceptTerms") && (
                <p
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.acceptTerms}
                </p>
              )}
            </div>
          </>
        )}

        {/* Step 4 - Upload Documents */}
        {step === 4 && (
          <>
            <div className="mb-6">
              <label htmlFor="documents" className="block font-medium mb-2">
                Upload Documents <span className="text-red-600">*</span>
              </label>
              <input
                id="documents"
                name="documents"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleInputChange}
                className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                  isFieldError("documents")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!isFieldError("documents")}
                aria-describedby={isFieldError("documents") ? "documents-error" : undefined}
                required
              />
              {isFieldError("documents") && (
                <p
                  id="documents-error"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.documents}
                </p>
              )}
              {formData.documents && formData.documents.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-gray-600">
                  {Array.from(formData.documents).map((file, idx) => (
                    <li key={idx}>
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        {/* Step 5 - Review & Submit */}
        {step === 5 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Review Your Details</h3>
            <div className="space-y-3">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-1">
                  <span className="capitalize font-medium">{key.replace(/([A-Z])/g, " $1")}:</span>
                  <span className="text-gray-700 max-w-xs truncate">
                    {Array.isArray(value)
                      ? value.join(", ")
                      : value && value.name
                      ? Array.from(value).map((file) => file.name).join(", ")
                      : value || "-"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10">
          {step > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-5 py-3 bg-gray-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className={`px-5 py-3 rounded-md focus:outline-none focus:ring-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {step === steps.length - 1 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
