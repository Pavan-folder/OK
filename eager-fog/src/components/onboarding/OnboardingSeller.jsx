import React, { useReducer, useState, useEffect } from "react";

// --- Constants ---
const categories = [
  "Agriculture",
  "Electronics",
  "Clothing",
  "Furniture",
  "Food & Beverages",
  "Other",
];

const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "LLC",
  "Corporation",
  "Other",
];

const initialFormData = {
  // Step 1
  name: "",
  email: "",
  phone: "",
  businessType: "",
  yearsExperience: "",
  // Step 2
  productCategories: [], // multi-select
  mainProducts: "",
  // Step 3
  location: "",
  operationalRegions: [], // multi-select
  priceRange: "",
  // Step 4
  businessLicense: null, // file upload
  productImages: [], // multiple files
  // Step 5
  description: "",
  website: "",
  socialLinks: "",
  // Step 6
  termsAccepted: false,
};

const steps = [
  "Basic Info",
  "Products",
  "Operations",
  "Uploads",
  "Details",
  "Terms & Submit",
];

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "UPDATE_MULTI_SELECT":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialFormData;
    default:
      return state;
  }
}

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?[\d\s\-]{7,15}$/.test(phone);
}

// Utility for localStorage save/load
const STORAGE_KEY = "sellerOnboardingForm";

export default function OnboardingSeller({ onComplete }) {
  const [formData, dispatch] = useReducer(formReducer, initialFormData);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Saved");

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: "RESET" });
        Object.keys(parsed).forEach((key) => {
          dispatch({ type: "UPDATE_FIELD", field: key, value: parsed[key] });
        });
      } catch {}
    }
  }, []);

  // Auto-save formData to localStorage with debounce
  useEffect(() => {
    setSaveStatus("Saving...");
    const handler = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setSaveStatus("Saved");
    }, 800);

    return () => clearTimeout(handler);
  }, [formData]);

  // Validate current step
  function validateStep() {
    let errs = {};
    switch (step) {
      case 0: // Basic Info
        if (!formData.name.trim()) errs.name = "Name is required";
        if (!formData.email.trim()) errs.email = "Email is required";
        else if (!validateEmail(formData.email)) errs.email = "Invalid email";
        if (!formData.phone.trim()) errs.phone = "Phone is required";
        else if (!validatePhone(formData.phone)) errs.phone = "Invalid phone";
        if (!formData.businessType) errs.businessType = "Select business type";
        if (
          formData.yearsExperience !== "" &&
          (isNaN(formData.yearsExperience) || formData.yearsExperience < 0)
        )
          errs.yearsExperience = "Invalid experience";
        break;
      case 1: // Products
        if (formData.productCategories.length === 0)
          errs.productCategories = "Select at least one category";
        if (!formData.mainProducts.trim())
          errs.mainProducts = "Describe main products";
        break;
      case 2: // Operations
        if (!formData.location.trim()) errs.location = "Location required";
        if (formData.operationalRegions.length === 0)
          errs.operationalRegions = "Select operational regions";
        if (!formData.priceRange.trim()) errs.priceRange = "Price range required";
        break;
      case 3: // Uploads
        if (!formData.businessLicense) errs.businessLicense = "Upload business license";
        if (formData.productImages.length === 0)
          errs.productImages = "Upload at least one product image";
        break;
      case 4: // Details
        if (!formData.description.trim())
          errs.description = "Business description is required";
        break;
      case 5: // Terms
        if (!formData.termsAccepted)
          errs.termsAccepted = "You must accept terms & conditions";
        break;
      default:
        break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Handlers
  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox" && name === "termsAccepted") {
      dispatch({ type: "UPDATE_FIELD", field: name, value: checked });
    } else if (type === "file") {
      if (name === "businessLicense") {
        dispatch({ type: "UPDATE_FIELD", field: name, value: files[0] || null });
      } else if (name === "productImages") {
        dispatch({ type: "UPDATE_FIELD", field: name, value: Array.from(files) });
      }
    } else {
      dispatch({ type: "UPDATE_FIELD", field: name, value });
    }
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handleMultiSelectChange(field, option) {
    const current = formData[field];
    let updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    dispatch({ type: "UPDATE_MULTI_SELECT", field, value: updated });
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function next() {
    if (validateStep()) {
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        // Submit final form
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          console.log("Seller Onboarding Submitted:", formData);
          localStorage.removeItem(STORAGE_KEY);
          if (onComplete) onComplete(formData);
          setStep(0);
          dispatch({ type: "RESET" });
          setErrors({});
          setTouched({});
          alert("Seller Onboarding Completed!");
        }, 2000);
      }
    }
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  // Helpers for error display
  const showError = (field) => touched[field] && errors[field];

  // Render helpers
  function renderStepContent() {
    switch (step) {
      case 0:
        return (
          <>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block font-semibold mb-1">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("name")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("name")}
                aria-describedby={showError("name") ? "error-name" : undefined}
                required
              />
              {showError("name") && (
                <p id="error-name" className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-semibold mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("email")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("email")}
                aria-describedby={showError("email") ? "error-email" : undefined}
                required
              />
              {showError("email") && (
                <p id="error-email" className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block font-semibold mb-1">
                Phone <span className="text-red-600">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("phone")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("phone")}
                aria-describedby={showError("phone") ? "error-phone" : undefined}
                required
              />
              {showError("phone") && (
                <p id="error-phone" className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Business Type */}
            <div className="mb-4">
              <label htmlFor="businessType" className="block font-semibold mb-1">
                Business Type <span className="text-red-600">*</span>
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("businessType")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("businessType")}
                aria-describedby={showError("businessType") ? "error-businessType" : undefined}
                required
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {showError("businessType") && (
                <p
                  id="error-businessType"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.businessType}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div className="mb-4">
              <label htmlFor="yearsExperience" className="block font-semibold mb-1">
                Years of Experience
              </label>
              <input
                id="yearsExperience"
                name="yearsExperience"
                type="number"
                min="0"
                value={formData.yearsExperience}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("yearsExperience")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("yearsExperience")}
                aria-describedby={showError("yearsExperience") ? "error-yearsExperience" : undefined}
              />
              {showError("yearsExperience") && (
                <p
                  id="error-yearsExperience"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.yearsExperience}
                </p>
              )}
            </div>
          </>
        );
      case 1:
        return (
          <>
            {/* Product Categories - Multi Select */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Product Categories <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className={`cursor-pointer px-3 py-1 rounded-md border ${
                      formData.productCategories.includes(cat)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      name="productCategories"
                      checked={formData.productCategories.includes(cat)}
                      onChange={() => handleMultiSelectChange("productCategories", cat)}
                      aria-checked={formData.productCategories.includes(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
              {showError("productCategories") && (
                <p className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.productCategories}
                </p>
              )}
            </div>

            {/* Main Products */}
            <div className="mb-4">
              <label htmlFor="mainProducts" className="block font-semibold mb-1">
                Main Products <span className="text-red-600">*</span>
              </label>
              <textarea
                id="mainProducts"
                name="mainProducts"
                value={formData.mainProducts}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("mainProducts")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("mainProducts")}
                aria-describedby={showError("mainProducts") ? "error-mainProducts" : undefined}
                rows="3"
                required
              />
              {showError("mainProducts") && (
                <p
                  id="error-mainProducts"
                  className="text-red-600 mt-1 text-sm"
                  role="alert"
                >
                  {errors.mainProducts}
                </p>
              )}
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Location */}
            <div className="mb-4">
              <label htmlFor="location" className="block font-semibold mb-1">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("location")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("location")}
                aria-describedby={showError("location") ? "error-location" : undefined}
                required
              />
              {showError("location") && (
                <p id="error-location" className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Operational Regions - Multi Select */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Operational Regions <span className="text-red-600">*</span>
              </label>
              <RegionSelector
                selectedRegions={formData.operationalRegions}
                onChange={(newRegions) =>
                  dispatch({ type: "UPDATE_MULTI_SELECT", field: "operationalRegions", value: newRegions })
                }
                error={showError("operationalRegions")}
                errorMessage={errors.operationalRegions}
              />
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <label htmlFor="priceRange" className="block font-semibold mb-1">
                Price Range <span className="text-red-600">*</span>
              </label>
              <input
                id="priceRange"
                name="priceRange"
                type="text"
                value={formData.priceRange}
                onChange={handleChange}
                placeholder="$10 - $100"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("priceRange")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("priceRange")}
                aria-describedby={showError("priceRange") ? "error-priceRange" : undefined}
                required
              />
              {showError("priceRange") && (
                <p id="error-priceRange" className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.priceRange}
                </p>
              )}
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* Business License Upload */}
            <div className="mb-4">
              <label htmlFor="businessLicense" className="block font-semibold mb-1">
                Business License <span className="text-red-600">*</span>
              </label>
              <input
                id="businessLicense"
                name="businessLicense"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("businessLicense")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("businessLicense")}
                aria-describedby={showError("businessLicense") ? "error-businessLicense" : undefined}
                required
              />
              {showError("businessLicense") && (
                <p id="error-businessLicense" className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.businessLicense}
                </p>
              )}
              {formData.businessLicense && (
                <p className="mt-1 text-gray-700">
                  Selected file: {formData.businessLicense.name}
                </p>
              )}
            </div>

            {/* Product Images Upload */}
            <div className="mb-4">
              <label htmlFor="productImages" className="block font-semibold mb-1">
                Product Images <span className="text-red-600">*</span>
              </label>
              <input
                id="productImages"
                name="productImages"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("productImages")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("productImages")}
                aria-describedby={showError("productImages") ? "error-productImages" : undefined}
                required
              />
              {showError("productImages") && (
                <p id="error-productImages" className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.productImages}
                </p>
              )}
              {formData.productImages.length > 0 && (
                <ul className="mt-1 text-gray-700 list-disc list-inside max-h-40 overflow-auto">
                  {formData.productImages.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        );
      case 4:
        return (
          <>
            {/* Business Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block font-semibold mb-1">
                Business Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  showError("description")
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                aria-invalid={!!showError("description")}
                aria-describedby={showError("description") ? "error-description" : undefined}
                rows={5}
                required
              />
              {showError("description") && (
                <p id="error-description" className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Website */}
            <div className="mb-4">
              <label htmlFor="website" className="block font-semibold mb-1">
                Website / Portfolio URL
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
              />
            </div>

            {/* Social Media Links */}
            <div className="mb-4">
              <label htmlFor="socialLinks" className="block font-semibold mb-1">
                Social Media Links (comma separated)
              </label>
              <input
                id="socialLinks"
                name="socialLinks"
                type="text"
                value={formData.socialLinks}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage, https://instagram.com/yourprofile"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-400"
              />
            </div>
          </>
        );
      case 5:
        return (
          <>
            <div className="mb-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="cursor-pointer"
                  aria-invalid={!!showError("termsAccepted")}
                  required
                />
                <span>
                  I accept the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Terms and Conditions
                  </a>
                  <span className="text-red-600">*</span>
                </span>
              </label>
              {showError("termsAccepted") && (
                <p className="text-red-600 mt-1 text-sm" role="alert">
                  {errors.termsAccepted}
                </p>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Review Your Information</h3>
              <div className="space-y-2 max-h-96 overflow-auto border p-4 rounded-md bg-gray-50">
                {Object.entries(formData).map(([key, value]) => {
                  let displayValue = "";
                  if (Array.isArray(value)) {
                    displayValue = value.join(", ");
                  } else if (value instanceof File) {
                    displayValue = value.name;
                  } else if (Array.isArray(value) && value.length === 0) {
                    displayValue = "-";
                  } else {
                    displayValue = value || "-";
                  }
                  // Format key nicely
                  const label = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());

                  return (
                    <div key={key} className="flex justify-between border-b py-1">
                      <span className="font-medium">{label}</span>
                      <span className="text-gray-700 max-w-xs truncate">{displayValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );
      default:
        return <div>Unknown Step</div>;
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md select-none">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Seller Onboarding
      </h1>

      {/* Progress bar */}
      <nav
        aria-label="Progress"
        className="flex justify-between mb-8 overflow-x-auto gap-2 select-none"
      >
        {steps.map((label, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(idx)}
            disabled={loading}
            aria-current={step === idx ? "step" : undefined}
            className={`flex-1 whitespace-nowrap text-center py-2 rounded-md cursor-pointer focus:outline-none focus:ring-2 ${
              idx === step
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : idx < step
                ? "bg-blue-200 text-blue-800"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        noValidate
      >
        {renderStepContent()}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0 || loading}
            className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {step === steps.length - 1 ? (loading ? "Submitting..." : "Submit") : "Next"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-sm text-gray-500 text-center">{saveStatus}</p>
    </div>
  );
}

// A helper component to pick multiple operational regions
function RegionSelector({ selectedRegions, onChange, error, errorMessage }) {
  const regions = [
    "North America",
    "South America",
    "Europe",
    "Asia",
    "Africa",
    "Australia",
    "Middle East",
  ];

  function toggleRegion(region) {
    if (selectedRegions.includes(region)) {
      onChange(selectedRegions.filter((r) => r !== region));
    } else {
      onChange([...selectedRegions, region]);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <button
            type="button"
            key={region}
            onClick={() => toggleRegion(region)}
            className={`px-3 py-1 rounded-md border ${
              selectedRegions.includes(region)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            aria-pressed={selectedRegions.includes(region)}
          >
            {region}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-red-600 mt-1 text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
