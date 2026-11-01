"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { DashboardStats } from "@/lib/stats";

const PIE_COLORS = ["#b9d7c8", "#5fce9d", "#34b681", "#1e6a47", "#0a3527", "#d9e6df", "#93a49b", "#be123c"];

export function MobilityChart({ data }: { data: DashboardStats["monthly"] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} barGap={4}>
          <CartesianGrid vertical={false} stroke="#eef3f0" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b7c74" }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b7c74" }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #e4ebe7", fontSize: 12, boxShadow: "0 12px 30px -20px rgba(13,26,21,.4)" }}
            cursor={{ fill: "rgba(30,106,71,0.06)" }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="outbound" name="Outbound" fill="#1e6a47" radius={[5, 5, 0, 0]} maxBarSize={16} />
          <Bar dataKey="inbound" name="Inbound" fill="#5fce9d" radius={[5, 5, 0, 0]} maxBarSize={16} />
          <Bar dataKey="pdln" name="PDLN" fill="#aed8c1" radius={[5, 5, 0, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusDonut({ data }: { data: DashboardStats["byStatus"] }) {
  const rows = useMemo(() => data.filter((d) => d.value > 0), [data]);
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="label" innerRadius={54} outerRadius={82} paddingAngle={2} strokeWidth={0}>
            {rows.map((row, i) => (
              <Cell key={row.status} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4ebe7", fontSize: 12 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart({ data }: { data: DashboardStats["monthly"] }) {
  const rows = useMemo(
    () => data.map((row) => ({ month: row.month, total: row.outbound + row.inbound + row.pdln })),
    [data]
  );
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34b681" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#34b681" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#eef3f0" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b7c74" }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6b7c74" }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4ebe7", fontSize: 12 }} />
          <Area type="monotone" dataKey="total" name="Total pengajuan" stroke="#1e6a47" strokeWidth={2} fill="url(#trendFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}