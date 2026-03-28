"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DifficultyChart({ data }: any) {
  const chartData = [
    { name: "Easy", value: data?.easy || 0 },
    { name: "Medium", value: data?.medium || 0 },
    { name: "Hard", value: data?.hard || 0 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            stroke="#64748B"
            tick={{ fill: "#94A3B8", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              background: "#161821",
              border: "1px solid #1E2230",
              borderRadius: "12px",
              color: "#fff",
            }}
          />

          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
            fill="#CCFF00"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}