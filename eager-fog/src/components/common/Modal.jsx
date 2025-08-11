// src/components/common/Modal.jsx
import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import Button from "./Button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // sm, md, lg, xl, fullscreen
  footer,
  showCloseButton = true,
  closeIcon = "✕",
  closeOnOverlayClick = true,
  overlayOpacity = 0.5,
  ariaLabelledBy,
  ariaDescribedBy,
  loading = false,
  className = "",
  overlayClassName = "",
  containerClassName = "",
}) => {
  const modalRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Focus trap handlers
  const handleTabKey = useCallback((e) => {
    if (!modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  }, []);

  // Handle keydown for ESC and TAB
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        handleTabKey(e);
      }
    },
    [onClose, handleTabKey]
  );

  // Lock scroll when modal open
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement;
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      // Return focus
      lastFocusedElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Modal size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    fullscreen:
      "w-full h-full max-w-none max-h-full rounded-none flex flex-col justify-center",
  };

  // Overlay opacity class helper
  const overlayStyle = {
    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
  };

  // Handle outside click
  const onOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      tabIndex={-1}
      ref={modalRef}
      onClick={onOverlayClick}
      className={`fixed inset-0 flex items-center justify-center z-[1000] outline-none ${overlayClassName}`}
      style={overlayStyle}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full mx-4
          ${sizeClasses[size]}
          ${containerClassName}
          flex flex-col
          max-h-[90vh]
          overflow-hidden
          `}
        role="document"
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <header
            className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700"
            id={ariaLabelledBy}
          >
            {title && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <span className="text-xl select-none">{closeIcon}</span>
              </button>
            )}
          </header>
        )}

        {/* Body */}
        <section
          className={`p-6 overflow-auto flex-grow ${loading ? "opacity-50 pointer-events-none" : ""
            }`}
          id={ariaDescribedBy}
        >
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ) : (
            children
          )}
        </section>

        {/* Footer */}
        {footer && (
          <footer className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
