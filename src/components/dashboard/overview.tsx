"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Jan",
    average: 65,
    current: 68,
  },
  {
    name: "Feb",
    average: 66,
    current: 70,
  },
  {
    name: "Mar",
    average: 68,
    current: 72,
  },
  {
    name: "Apr",
    average: 70,
    current: 75,
  },
  {
    name: "May",
    average: 72,
    current: 78,
  },
  {
    name: "Jun",
    average: 74,
    current: 82,
  },
  {
    name: "Jul",
    average: 76,
    current: 76,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="current"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
