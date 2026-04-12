"use client";

import { CustomTooltipProps } from '@/types/superadmin/index.types';

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        minWidth: "130px",
      }}
    >
      <p
        style={{
          color: "var(--muted-foreground)",
          fontSize: "12px",
          marginBottom: "4px",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          color: "var(--foreground)",
          fontSize: "22px",
          fontWeight: 600,
          lineHeight: 1.2,
          display: "flex",
          alignItems: "baseline",
          gap: "5px",
        }}
      >
        {payload[0].value}
        <span
          style={{
            fontSize: "12px",
            fontWeight: 400,
            color: "var(--muted-foreground)",
          }}
        >
          batches
        </span>
      </p>
    </div>
  );
}
