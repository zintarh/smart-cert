"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  change,
  changeType = "neutral",
}: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            iconColor
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={cn(
                "text-sm mt-1",
                changeType === "positive" && "#FBE7E7",
                changeType === "negative" && "#FBE7E7",
                changeType === "neutral" && "#FBE7E7"
              )}
            >
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
