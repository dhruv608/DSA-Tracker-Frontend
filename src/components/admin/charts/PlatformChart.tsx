"use client";

import { motion } from "framer-motion";

type Props = {
  data: {
    leetcode?: number;
    gfg?: number;
    interviewbit?: number;
    other?: number;
  };
};

export default function PlatformChart({ data }: Props) {
  const total =
    (data?.leetcode || 0) +
    (data?.gfg || 0) +
    (data?.interviewbit || 0) +
    (data?.other || 0);

  const items = [
    { name: "LeetCode", value: data?.leetcode || 0, color: "#CCFF00" },
    { name: "GFG", value: data?.gfg || 0, color: "#00F0FF" },
    { name: "Interview", value: data?.interviewbit || 0, color: "#4999e9" },
    { name: "Other", value: data?.other || 0, color: "#EF4444" },
  ];

  return (
    <div className="space-y-5">
      {items.map((item, i) => {
        const percent = total ? (item.value / total) * 100 : 0;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            {/* HEADER */}
            <div className="flex justify-between text-sm mb-2">
              <span>{item.name}</span>

              <motion.span
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2 + 0.2 }}
              >
                {item.value} • {Math.round(percent)}%
              </motion.span>
            </div>

            {/* BAR BACKGROUND */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              {/* ANIMATED BAR */}
              <motion.div
                className="h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                whileHover={{
                  filter: "brightness(1.2)",
                  scaleY: 1.3,
                }}
                style={{
                  background: item.color,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
