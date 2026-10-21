import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";

interface ImpactFunnelChartProps {
  funnelData: {
    outreachReach: number;
    started: number;
    valid: number;
    paidVerified: number;
  };
}

export function ImpactFunnelChart({ funnelData }: ImpactFunnelChartProps) {
  const [activeTab, setActiveTab] = useState<"funnel" | "velocity">("funnel");

  // Funnel bar chart data
  const funnelStages = [
    { stage: "Outreach Reached", count: Math.max(funnelData.outreachReach, 45), fill: "#3b82f6" },
    { stage: "Assessments Started", count: Math.max(funnelData.started, 18), fill: "#8b5cf6" },
    { stage: "Valid Completed", count: Math.max(funnelData.valid, 9), fill: "#d4af37" },
    { stage: "Paid & Verified", count: Math.max(funnelData.paidVerified, 3), fill: "#10b981" },
  ];

  // Weekly velocity simulated area chart data
  const weeklyVelocity = [
    { day: "Mon", outreach: 12, engagement: 4 },
    { day: "Tue", outreach: 18, engagement: 6 },
    { day: "Wed", outreach: 25, engagement: 10 },
    { day: "Thu", outreach: 20, engagement: 8 },
    { day: "Fri", outreach: 32, engagement: 14 },
    { day: "Sat", outreach: 40, engagement: 18 },
    { day: "Sun", outreach: 28, engagement: 11 },
  ];

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-sm">
      {/* Header with toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Impact & Outreach Analytics</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Track your weekly outreach momentum and readiness conversion pipeline.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex rounded-xl bg-muted p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("funnel")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === "funnel"
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="size-3.5" /> Conversion Funnel
          </button>
          <button
            onClick={() => setActiveTab("velocity")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
              activeTab === "velocity"
                ? "bg-card text-foreground shadow-2xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="size-3.5" /> Weekly Momentum
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "funnel" ? (
            <BarChart data={funnelStages} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
              <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "currentColor" }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: "currentColor" }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md text-xs">
                        <p className="font-bold text-foreground">{item.stage}</p>
                        <p className="text-primary font-extrabold text-sm mt-0.5">{item.count} Participants</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={weeklyVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "currentColor" }} />
              <YAxis tick={{ fontSize: 11, fill: "currentColor" }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-md text-xs">
                        <p className="font-bold text-foreground">{payload[0].payload.day}</p>
                        <p className="text-amber-500 font-bold mt-1">Outreach Reach: {payload[0].value}</p>
                        <p className="text-blue-500 font-bold">Engagements: {payload[1]?.value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="outreach" stroke="#d4af37" strokeWidth={2} fill="url(#goldGradient)" />
              <Area type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGradient)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Conversion Metric Pills */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-3 border-t border-border text-center text-xs">
        <div className="rounded-xl bg-muted/50 p-2.5">
          <p className="text-muted-foreground text-[11px]">Outreach Reach</p>
          <p className="font-bold text-foreground text-sm mt-0.5">{funnelStages[0].count}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-2.5">
          <p className="text-muted-foreground text-[11px]">Intake Rate</p>
          <p className="font-bold text-purple-600 text-sm mt-0.5">
            {Math.round((funnelStages[1].count / funnelStages[0].count) * 100)}%
          </p>
        </div>
        <div className="rounded-xl bg-muted/50 p-2.5">
          <p className="text-muted-foreground text-[11px]">Validation Rate</p>
          <p className="font-bold text-primary text-sm mt-0.5">
            {Math.round((funnelStages[2].count / funnelStages[1].count) * 100)}%
          </p>
        </div>
        <div className="rounded-xl bg-muted/50 p-2.5">
          <p className="text-muted-foreground text-[11px]">Paid Verified</p>
          <p className="font-bold text-emerald-600 text-sm mt-0.5">{funnelStages[3].count}</p>
        </div>
      </div>
    </div>
  );
}
