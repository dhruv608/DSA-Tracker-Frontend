import React from "react";

interface TooltipProps {
  x: number;
  y: number;
  text: string;
}

export default function CustomTooltip({ x, y, text }: TooltipProps) {
  return (
    <div
      className="
        fixed z-50 px-3 py-1.5
        text-xs font-medium
        rounded-md
        bg-black/90 text-white
        backdrop-blur-md
        pointer-events-none
        transform 
        transition-all duration-150
        animate-in fade-in zoom-in-95
        shadow-lg
      "
      style={{
        left: x,
        top: y,
      }}
    >
      {text}

      {/* 🔻 Small Arrow */}
      <div
        className="
          absolute left-1/2 top-full
          -translate-x-1/2
          w-2 h-2
          bg-black/90
          rotate-45
        "
      />
    </div>
  );
}