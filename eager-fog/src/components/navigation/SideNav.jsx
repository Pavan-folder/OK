// src/components/SideNav.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  LogIn,
  HelpCircle,
} from "lucide-react";

const navLinks = [
  {
    label: "Dashboard",
    icon: <Home size={20} />,
    href: "#",
  },
  {
    label: "Buyers",
    icon: <Users size={20} />,
    href: "#",
    badge: 3,
  },
  {
    label: "Opportunities",
    icon: <Briefcase size={20} />,
    href: "#",
    submenu: [
      { label: "Active Deals", href: "#" },
      { label: "Closed Deals", href: "#" },
      { label: "Drafts", href: "#" },
    ],
  },
  {
    label: "Settings",
    icon: <Settings size={20} />,
    href: "#",
  },
];

export default function SideNav() {
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const sidebarRef = useRef();

  // Close profile dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  // Toggle sidebar for mobile
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Toggle submenu open state
  const toggleSubmenu = (label) => {
    if (submenuOpen === label) {
      setSubmenuOpen(null);
    } else {
      setSubmenuOpen(label);
    }
  };

  // Handle logout confirm
  const handleLogout = () => {
    setShowLogoutModal(false);
    alert("Logged out! (Replace this alert with real logout logic)");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="sidebar"
        className="lg:hidden p-2 text-gray-700 fixed top-4 left-4 z-50 bg-white shadow rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        ref={sidebarRef}
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 fixed lg:static z-40 h-full w-64 bg-white border-r shadow-sm flex flex-col`}
      >
        {/* Profile Section */}
        <div className="p-4 flex items-center gap-3 border-b relative">
          {/* Profile Photo with "P" */}
          <div
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={profileDropdownOpen}
            aria-label="User menu"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer select-none font-semibold text-xl"
          >
            P
          </div>
          <div className="flex-1">
            <p
              className="font-semibold text-gray-800 cursor-pointer"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setProfileDropdownOpen(!profileDropdownOpen)}
            >
              Pavan Kumar
            </p>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            aria-label="Toggle user menu"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1 hover:bg-gray-100"
          >
            <ChevronDown
              size={20}
              className={`${profileDropdownOpen ? "rotate-180" : ""} transition-transform`}
            />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <ul
              role="menu"
              aria-label="User menu"
              className="absolute top-full left-4 mt-2 w-48 bg-white border rounded shadow-lg z-50"
            >
              <li
                role="menuitem"
                tabIndex={0}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => alert("Profile clicked")}
                onKeyDown={(e) => e.key === "Enter" && alert("Profile clicked")}
              >
                <User size={18} /> Profile
              </li>
              <li
                role="menuitem"
                tabIndex={0}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => alert("Help clicked")}
                onKeyDown={(e) => e.key === "Enter" && alert("Help clicked")}
              >
                <HelpCircle size={18} /> Help
              </li>
              <li
                role="menuitem"
                tabIndex={0}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-600"
                onClick={() => setShowLogoutModal(true)}
                onKeyDown={(e) => e.key === "Enter" && setShowLogoutModal(true)}
              >
                <LogOut size={18} /> Logout
              </li>
            </ul>
          )}
        </div>

        {/* Navigation Links */}
        <nav
          className="flex-1 p-4 overflow-y-auto"
          aria-label="Main navigation"
          role="navigation"
        >
          <ul className="space-y-1">
            {navLinks.map(({ label, icon, href, badge, submenu }) => {
              const isActive = active === label || (submenu && submenu.some((item) => item.label === active));
              const hasSubmenu = Array.isArray(submenu);
              const isSubmenuOpen = submenuOpen === label;

              return (
                <li key={label} className="relative">
                  {!hasSubmenu ? (
                    <a
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        setActive(label);
                        setSubmenuOpen(null);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {icon}
                      <span>{label}</span>
                      {badge && (
                        <span className="ml-auto inline-block bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          {badge}
                        </span>
                      )}
                    </a>
                  ) : (
                    <>
                      <button
                        type="button"
                        aria-expanded={isSubmenuOpen}
                        aria-controls={`${label}-submenu`}
                        onClick={() => toggleSubmenu(label)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {icon}
                        <span className="flex-1 text-left">{label}</span>
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform duration-300 ${
                            isSubmenuOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                      <ul
                        id={`${label}-submenu`}
                        role="menu"
                        aria-label={`${label} submenu`}
                        className={`pl-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                          isSubmenuOpen ? "max-h-96" : "max-h-0"
                        }`}
                        style={{ willChange: "max-height" }}
                      >
                        {submenu.map((item) => {
                          const isSubActive = active === item.label;
                          return (
                            <li key={item.label}>
                              <a
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setActive(item.label);
                                  setSubmenuOpen(label);
                                }}
                                className={`block px-3 py-2 rounded text-sm font-medium transition-colors ${
                                  isSubActive
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                                aria-current={isSubActive ? "page" : undefined}
                              >
                                {item.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            type="button"
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded p-6 w-80 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="logout-modal-title" className="text-xl font-semibold mb-4">
              Confirm Logout
            </h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
