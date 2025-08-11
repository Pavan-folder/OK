import React, { useState } from "react";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const handleSave = () => {
    alert(
      `Settings saved:
Email Notifications: ${emailNotifications}
Dark Mode: ${darkMode}
Auto Play Videos: ${autoPlayVideos}
Language: ${language}
Timezone: ${timezone}`
    );
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <label htmlFor="emailNotifications" className="text-gray-700 font-medium">
            Email Notifications
          </label>
          <input
            id="emailNotifications"
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <label htmlFor="darkMode" className="text-gray-700 font-medium">
            Dark Mode
          </label>
          <input
            id="darkMode"
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>

        {/* Auto Play Videos */}
        <div className="flex items-center justify-between">
          <label htmlFor="autoPlayVideos" className="text-gray-700 font-medium">
            Auto Play Videos
          </label>
          <input
            id="autoPlayVideos"
            type="checkbox"
            checked={autoPlayVideos}
            onChange={(e) => setAutoPlayVideos(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>

        {/* Language Select */}
        <div>
          <label htmlFor="language" className="block mb-1 text-gray-700 font-medium">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Timezone Select */}
        <div>
          <label htmlFor="timezone" className="block mb-1 text-gray-700 font-medium">
            Timezone
          </label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
            <option value="Australia/Sydney">Australia/Sydney</option>
          </select>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
