// src/components/ProgressIndicator.jsx
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  ERROR: "error",
  WARNING: "warning",
  LOADING: "loading",
};

const defaultColors = {
  [STATUS.PENDING]: "#d1d5db", // gray-300
  [STATUS.ACTIVE]: "#3b82f6", // blue-500
  [STATUS.COMPLETED]: "#10b981", // green-500
  [STATUS.ERROR]: "#ef4444", // red-500
  [STATUS.WARNING]: "#f59e0b", // amber-500
  [STATUS.LOADING]: "#6366f1", // indigo-500
};

function Step({
  index,
  label,
  status,
  onClick,
  isClickable,
  size,
  colorMap,
  showTooltip,
  tooltipContent,
  icon,
  badge,
  id,
  isVertical,
}) {
  const [hover, setHover] = useState(false);

  const baseColor = colorMap[status] || defaultColors[STATUS.PENDING];
  const isCompleted = status === STATUS.COMPLETED;
  const isActive = status === STATUS.ACTIVE;
  const isError = status === STATUS.ERROR;
  const isWarning = status === STATUS.WARNING;
  const isLoading = status === STATUS.LOADING;

  // Accessibility
  const ariaCurrent = isActive ? "step" : undefined;
  const tabIndex = isClickable ? 0 : -1;

  return (
    <div
      role="listitem"
      aria-current={ariaCurrent}
      tabIndex={tabIndex}
      onClick={isClickable ? () => onClick(index) : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(index);
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex ${isVertical ? "flex-col items-center" : "items-center"}`}
      id={id}
      style={{ cursor: isClickable ? "pointer" : "default", outline: "none" }}
    >
      <div
        className="relative flex items-center justify-center rounded-full font-bold text-white select-none"
        style={{
          width: size,
          height: size,
          backgroundColor: baseColor,
          transition: "background-color 0.3s ease",
          boxShadow: isActive ? `0 0 8px ${baseColor}` : undefined,
        }}
        aria-label={`${label} - ${status}`}
      >
        {isLoading ? (
          <LoadingSpinner size={size * 0.6} color="#fff" />
        ) : icon ? (
          icon
        ) : isCompleted ? (
          "✓"
        ) : (
          index + 1
        )}

        {/* Badge */}
        {badge && (
          <span
            className="absolute -top-1 -right-2 text-xs font-semibold rounded-full px-1"
            style={{
              backgroundColor: isError ? "#ef4444" : "#3b82f6",
              color: "white",
              minWidth: 18,
              textAlign: "center",
              lineHeight: "1.2em",
              userSelect: "none",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <span
        className={`ml-3 select-none text-sm font-medium ${
          isActive || isCompleted ? "text-gray-900" : "text-gray-500"
        } ${isVertical ? "mt-2 ml-0 text-center max-w-xs" : ""}`}
      >
        {label}
      </span>

      {/* Tooltip */}
      {showTooltip && hover && tooltipContent && (
        <Tooltip content={tooltipContent} />
      )}
    </div>
  );
}

Step.propTypes = {
  index: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(STATUS)),
  onClick: PropTypes.func,
  isClickable: PropTypes.bool,
  size: PropTypes.number,
  colorMap: PropTypes.object,
  showTooltip: PropTypes.bool,
  tooltipContent: PropTypes.node,
  icon: PropTypes.node,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  isVertical: PropTypes.bool,
};

Step.defaultProps = {
  status: STATUS.PENDING,
  isClickable: false,
  size: 32,
  colorMap: {},
  showTooltip: false,
  tooltipContent: null,
  icon: null,
  badge: null,
  id: null,
  isVertical: false,
};

function LoadingSpinner({ size, color }) {
  return (
    <svg
      className="animate-spin"
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
        stroke={color}
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default function ProgressIndicator({
  steps,
  currentStep,
  onStepClick,
  isClickable = false,
  isVertical = false,
  size = 32,
  colorMap = {},
  showTooltips = false,
  className = "",
  ariaLabel = "Progress Steps",
}) {
  const containerRef = useRef(null);

  // Keyboard navigation inside the step list
  const handleKeyDown = (e) => {
    if (!isClickable) return;
    const { key } = e;
    const stepCount = steps.length;
    let newIndex = currentStep;

    if (key === "ArrowRight" || key === "ArrowDown") {
      newIndex = (currentStep + 1) % stepCount;
      onStepClick(newIndex);
      e.preventDefault();
    } else if (key === "ArrowLeft" || key === "ArrowUp") {
      newIndex = (currentStep - 1 + stepCount) % stepCount;
      onStepClick(newIndex);
      e.preventDefault();
    }
  };

  return (
    <nav
      ref={containerRef}
      aria-label={ariaLabel}
      role="list"
      className={`flex ${isVertical ? "flex-col" : "flex-row"} items-center justify-center gap-6 ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {steps.map((step, i) => {
        let status = STATUS.PENDING;
        if (i < currentStep) status = STATUS.COMPLETED;
        else if (i === currentStep) status = STATUS.ACTIVE;

        // You could extend to accept custom status per step here...

        return (
          <React.Fragment key={step.label || step}>
            <Step
              index={i}
              label={typeof step === "string" ? step : step.label}
              status={status}
              onClick={isClickable ? onStepClick : null}
              isClickable={isClickable}
              size={size}
              colorMap={{ ...defaultColors, ...colorMap }}
              showTooltip={showTooltips}
              tooltipContent={step.tooltipContent || null}
              icon={step.icon || null}
              badge={step.badge || null}
              id={`step-${i}`}
              isVertical={isVertical}
            />
            {/* Connector line except after last step */}
            {i < steps.length - 1 && (
              <ConnectorLine
                isCompleted={i < currentStep - 1}
                isVertical={isVertical}
                size={size}
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

ProgressIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        tooltipContent: PropTypes.node,
        icon: PropTypes.node,
        badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ])
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func,
  isClickable: PropTypes.bool,
  isVertical: PropTypes.bool,
  size: PropTypes.number,
  colorMap: PropTypes.object,
  showTooltips: PropTypes.bool,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

ProgressIndicator.defaultProps = {
  onStepClick: null,
  isClickable: false,
  isVertical: false,
  size: 32,
  colorMap: {},
  showTooltips: false,
  className: "",
  ariaLabel: "Progress Steps",
};

function ConnectorLine({ isCompleted, isVertical, size }) {
  return (
    <div
      aria-hidden="true"
      className={`${
        isVertical ? "w-1 h-8" : "h-1 w-8"
      } rounded bg-gray-300 transition-colors duration-300`}
      style={{
        backgroundColor: isCompleted ? "#10b981" : "#d1d5db",
      }}
    />
  );
}

ConnectorLine.propTypes = {
  isCompleted: PropTypes.bool.isRequired,
  isVertical: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
};
