// src/components/common/Card.jsx
import React, { useState, useRef, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";

/**
 * Card Component
 * 
 * Features:
 * - Header, Body, Footer slots
 * - Optional Media (image/video) section
 * - Variants for shadow intensity
 * - Expandable/collapsible body with animation
 * - Loading skeleton state
 * - Action buttons area (top right or footer)
 * - Custom padding, margin, rounded corners
 * - Hover and focus effects
 * - Responsive design support
 * - Accessibility with aria attributes
 * - Exposes sub-components for composition
 * - Tailwind CSS based styles
 */
const Card = forwardRef(
  (
    {
      children,
      header,
      footer,
      media,
      actions,
      variant = "default",
      loading = false,
      rounded = "xl",
      shadow = "md",
      padding = "p-6",
      margin = "m-2",
      collapsible = false,
      defaultExpanded = false,
      className = "",
      style = {},
      id,
      "aria-label": ariaLabel,
      ...rest
    },
    ref
  ) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const bodyRef = useRef(null);
    const [bodyHeight, setBodyHeight] = useState("auto");

    // Animate height on expand/collapse
    useEffect(() => {
      if (collapsible && bodyRef.current) {
        if (expanded) {
          setBodyHeight(bodyRef.current.scrollHeight + "px");
        } else {
          setBodyHeight("0px");
        }
      }
    }, [expanded, collapsible]);

    // Variants mapping to Tailwind shadows
    const shadowVariants = {
      none: "shadow-none",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl",
      default: "shadow-md",
    };

    // Rounded corners mapping
    const roundedVariants = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      full: "rounded-full",
    };

    // Base classes
    const baseClass = `bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col
      ${shadowVariants[shadow]} ${roundedVariants[rounded]} ${padding} ${margin} 
      transition-shadow duration-300 ease-in-out
      hover:shadow-xl focus-within:shadow-xl
      relative
      `;

    // Loading skeleton styles
    const skeletonClass = `animate-pulse bg-gray-300 dark:bg-gray-700 rounded`;

    return (
      <article
        id={id}
        ref={ref}
        className={`${baseClass} ${className}`}
        aria-label={ariaLabel || "Card component"}
        {...rest}
      >
        {/* Media section */}
        {media && (
          <div className="w-full mb-4 overflow-hidden rounded-t-lg">
            {loading ? (
              <div className={`${skeletonClass} h-48 w-full`}></div>
            ) : (
              media
            )}
          </div>
        )}

        {/* Header */}
        {header && (
          <header className="flex justify-between items-center mb-3">
            <div className="text-xl font-semibold">{header}</div>
            {actions && !collapsible && (
              <div className="flex space-x-2">{actions}</div>
            )}
            {collapsible && (
              <button
                aria-expanded={expanded}
                aria-controls={`${id}-body`}
                onClick={() => setExpanded(!expanded)}
                className="ml-4 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={expanded ? "Collapse card content" : "Expand card content"}
              >
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${
                    expanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </header>
        )}

        {/* Body - collapsible or static */}
        <section
          id={`${id}-body`}
          ref={bodyRef}
          className={`overflow-hidden transition-[height] duration-300 ease-in-out`}
          style={collapsible ? { height: bodyHeight } : undefined}
          aria-live="polite"
        >
          {loading ? (
            <>
              <div className={`${skeletonClass} h-6 mb-3 w-3/4 rounded`}></div>
              <div className={`${skeletonClass} h-4 mb-2 w-full rounded`}></div>
              <div className={`${skeletonClass} h-4 mb-2 w-5/6 rounded`}></div>
              <div className={`${skeletonClass} h-4 mb-2 w-2/3 rounded`}></div>
            </>
          ) : (
            children
          )}
        </section>

        {/* Footer */}
        {footer && (
          <footer className="mt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-3">
            <div>{footer}</div>
            {actions && collapsible && <div className="flex space-x-2">{actions}</div>}
          </footer>
        )}
      </article>
    );
  }
);

Card.displayName = "Card";

Card.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  media: PropTypes.node,
  actions: PropTypes.node,
  variant: PropTypes.string,
  loading: PropTypes.bool,
  rounded: PropTypes.oneOf([
    "none",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "full",
  ]),
  shadow: PropTypes.oneOf([
    "none",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "default",
  ]),
  padding: PropTypes.string,
  margin: PropTypes.string,
  collapsible: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.string,
  "aria-label": PropTypes.string,
};

export default Card;
