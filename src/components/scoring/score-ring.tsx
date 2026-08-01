"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function ScoreRing({
  percentage,
  grade,
  size = 160,
  strokeWidth = 12,
  color = "var(--color-primary)",
  className,
}: {
  percentage: number;
  grade?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percentage));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-muted"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold tabular-nums"
        >
          {Math.round(clamped)}%
        </motion.span>
        {grade && <span className="text-sm font-medium text-muted-foreground">Grade {grade}</span>}
      </div>
    </div>
  );
}
