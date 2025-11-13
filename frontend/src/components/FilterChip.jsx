// src/components/FilterChip.jsx
import React from "react";

export default function FilterChip({
  children,
  selected = false,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        "px-3 py-1 rounded-full border transition-colors text-sm",
        selected
          ? "bg-white text-black border-white"
          : "bg-transparent text-white border-white/40 hover:bg-white/10",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 focus:ring-offset-primary",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
