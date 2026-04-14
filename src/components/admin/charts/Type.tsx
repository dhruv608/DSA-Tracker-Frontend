"use client";

import { motion } from "framer-motion";

type Props = {
  data: Record<string, number> | undefined;
};

export default function TypeChart({ data }: Props) {
  const classwork = data?.classwork || 0;
  const homework = data?.homework || 0;

  const total = classwork + homework || 1;

  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  const classPercent = classwork / total;
  const homeworkPercent = homework / total;

  const classDash = classPercent * circumference;
  const homeworkDash = homeworkPercent * circumference;

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* RING */}
      <div className="relative w-56 h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g transform="rotate(-90 100 100)">
            
            {/* BACKGROUND TRACK */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#1E2230"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* CLASSWORK ARC */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#CCFF00"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${classDash} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${classDash} ${circumference}` }}
              transition={{ duration: 1, ease: "easeOut" }}
              
            />

            {/* HOMEWORK ARC */}
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#00F0FF"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${homeworkDash} ${circumference}`}
              strokeDashoffset={-classDash}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{
                strokeDasharray: `${homeworkDash} ${circumference}`,
              }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              
            />
          </g>
        </svg>

        {/* CENTER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-2xl font-semibold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {classwork + homework}
          </motion.div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#CCFF00]" />
          <span className="text-xs text-muted-foreground">
            Classwork ({Math.round(classPercent * 100)}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00F0FF]" />
          <span className="text-xs text-muted-foreground">
            Homework ({Math.round(homeworkPercent * 100)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
