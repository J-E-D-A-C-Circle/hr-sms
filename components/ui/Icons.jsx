"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

export function Icon({ name, className = "w-5 h-5", size = 20, color = undefined }) {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;

  if (IconComponent) {
    return <IconComponent className={className} size={size} color={color} />;
  }

  // Fallback SVG icon if icon name not found
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export default Icon;
