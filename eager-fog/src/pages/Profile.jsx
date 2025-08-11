import React, { useState } from "react";
import Button from "../components/common/Button";

export default function Profile() {
  // State for form inputs
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");

  // State for validation and messages
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // Simple email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone validation (simple numeric check)
  const validatePhone = (phone) => {
    return /^[0-9]{10,15}$/.test(phone);
  };

  const handleSubmit = () => {
    let tempErrors = {};

    if (!name.trim()) tempErrors.name = "Name is required";
    if (!email.trim()) tempErrors.email = "Email is required";
    else if (!validateEmail(email)) tempErrors.email = "Invalid email format";

    if (phone && !validatePhone(phone)) tempErrors.phone = "Invalid phone number";

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      // Simulate profile update
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setSuccessMsg("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Your Profile</h1>

      <div className="bg-white shadow rounded p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`border rounded p-2 w-full focus:outline-none focus:ring-2 ${
              errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border rounded p-2 w-full focus:outline-none focus:ring-2 ${
              errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`border rounded p-2 w-full focus:outline-none focus:ring-2 ${
              errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
            placeholder="Your city, state, or country"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
            placeholder="Tell us about yourself"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="twitter">
            Twitter Handle
          </label>
          <input
            id="twitter"
            type="text"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
            placeholder="@yourhandle"
          />
        </div>

        <div>
          <Button onClick={handleSubmit} className="w-full">
            Update Profile
          </Button>
          {successMsg && (
            <p className="text-green-600 mt-2 font-medium text-center">{successMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
