// src/components/common/Button.jsx
import React, { useState, useRef, useEffect, forwardRef } from "react";
import PropTypes from "prop-types";

// Spinner SVG component for loading state
const LoadingSpinner = ({ size = 16, className = "" }) => (
  <svg
    className={`animate-spin text-white ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-label="Loading"
    role="img"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

// Ripple effect component
const Ripple = ({ x, y, size }) => (
  <span
    className="absolute rounded-full bg-white opacity-30 animate-ripple"
    style={{
      top: y,
      left: x,
      width: size,
      height: size,
      pointerEvents: "none",
    }}
  />
);

/**
 * Button Component
 * 
 * Supports:
 * - variants: primary, secondary, danger, outline, ghost, link
 * - sizes: xs, sm, md, lg, xl
 * - shapes: rounded, pill, square
 * - loading state with spinner
 * - disabled state
 * - left and right icons
 * - ripple click effect
 * - tooltip on hover/focus
 * - render as <button> or <a>
 * - full aria accessibility
 * - Tailwind CSS utility classes
 */
const Button = forwardRef(
  (
    {
      children,
      onClick,
      type = "button",
      variant = "primary",
      size = "md",
      shape = "rounded",
      disabled = false,
      loading = false,
      leftIcon = null,
      rightIcon = null,
      ripple = true,
      tooltip = "",
      as = "button",
      href,
      target,
      rel,
      className = "",
      ariaLabel,
      ...rest
    },
    ref
  ) => {
    // Ripples state array
    const [ripples, setRipples] = useState([]);
    const rippleContainerRef = useRef(null);

    // Clear ripples after animation
    useEffect(() => {
      if (ripples.length > 0) {
        const timeout = setTimeout(() => setRipples([]), 500);
        return () => clearTimeout(timeout);
      }
    }, [ripples]);

    // Handle click to add ripple effect and call onClick handler
    const handleClick = (e) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }

      if (ripple && rippleContainerRef.current) {
        const rect = rippleContainerRef.current.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const newRipple = { x, y, size, key: Date.now() };
        setRipples((old) => [...old, newRipple]);
      }

      if (onClick) onClick(e);
    };

    // Tailwind class mappings for variants
    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 active:bg-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
      outline:
        "border border-gray-400 text-gray-800 hover:bg-gray-100 focus:ring-gray-400 active:bg-gray-200",
      ghost:
        "bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-300 active:bg-gray-200",
      link:
        "bg-transparent text-blue-600 hover:underline focus:ring-transparent active:text-blue-800",
    };

    // Tailwind size classes
    const sizes = {
      xs: "text-xs px-2 py-1",
      sm: "text-sm px-3 py-1.5",
      md: "text-base px-4 py-2",
      lg: "text-lg px-5 py-3",
      xl: "text-xl px-6 py-4",
    };

    // Tailwind shape classes
    const shapes = {
      rounded: "rounded-md",
      pill: "rounded-full",
      square: "rounded-none",
    };

    // Base styles for button
    const baseStyles =
      "relative inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed";

    // Compose all classes dynamically
    const combinedClassName = [
      baseStyles,
      sizes[size] || sizes.md,
      shapes[shape] || shapes.rounded,
      variants[variant] || variants.primary,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Decide component type (button or anchor)
    const Component = as === "a" ? "a" : "button";

    return (
      <>
        {tooltip && !disabled && !loading ? (
          <span className="relative group inline-block">
            <Component
              ref={rippleContainerRef}
              type={Component === "button" ? type : undefined}
              href={href}
              target={target}
              rel={rel}
              aria-label={ariaLabel || tooltip}
              disabled={disabled || loading}
              onClick={handleClick}
              className={combinedClassName}
              {...rest}
            >
              {/* Loading spinner */}
              {loading && (
                <LoadingSpinner
                  className="absolute left-3"
                  size={size === "xs" ? 12 : size === "sm" ? 14 : 16}
                />
              )}

              {/* Left Icon */}
              {leftIcon && !loading && (
                <span className="mr-2 flex items-center">{leftIcon}</span>
              )}

              {/* Button content */}
              <span className={loading ? "opacity-0" : undefined}>
                {children}
              </span>

              {/* Right Icon */}
              {rightIcon && !loading && (
                <span className="ml-2 flex items-center">{rightIcon}</span>
              )}

              {/* Ripple container */}
              <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
                {ripples.map(({ x, y, size, key }) => (
                  <Ripple key={key} x={x} y={y} size={size} />
                ))}
              </span>
            </Component>
            {/* Tooltip */}
            <span
              role="tooltip"
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100
                group-focus:opacity-100 pointer-events-none select-none whitespace-nowrap z-50
                transition-opacity duration-200"
            >
              {tooltip}
            </span>
          </span>
        ) : (
          <Component
            ref={rippleContainerRef}
            type={Component === "button" ? type : undefined}
            href={href}
            target={target}
            rel={rel}
            aria-label={ariaLabel}
            disabled={disabled || loading}
            onClick={handleClick}
            className={combinedClassName}
            {...rest}
          >
            {loading && (
              <LoadingSpinner
                className="absolute left-3"
                size={size === "xs" ? 12 : size === "sm" ? 14 : 16}
              />
            )}
            {leftIcon && !loading && (
              <span className="mr-2 flex items-center">{leftIcon}</span>
            )}
            <span className={loading ? "opacity-0" : undefined}>{children}</span>
            {rightIcon && !loading && (
              <span className="ml-2 flex items-center">{rightIcon}</span>
            )}
            <span className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
              {ripples.map(({ x, y, size, key }) => (
                <Ripple key={key} x={x} y={y} size={size} />
              ))}
            </span>
          </Component>
        )}
      </>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "danger",
    "outline",
    "ghost",
    "link",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  shape: PropTypes.oneOf(["rounded", "pill", "square"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  ripple: PropTypes.bool,
  tooltip: PropTypes.string,
  as: PropTypes.oneOf(["button", "a"]),
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;
