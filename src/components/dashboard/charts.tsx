"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number | string; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-popover-foreground">{label}</p>}
      {payload.map((entry) => (
        <p key={entry.name} className="text-muted-foreground">
          {entry.name}: <span className="font-medium text-popover-foreground">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function ChartShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ScoreDistributionChart({ data }: { data: { range: string; count: number }[] }) {
  return (
    <ChartShell title="Creator Score Distribution">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="count" name="Creators" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.range} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartShell>
  );
}

export function RelationshipFunnelChart({ data }: { data: { stage: string; count: number }[] }) {
  return (
    <ChartShell title="Relationship Funnel">
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
        <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis dataKey="stage" type="category" fontSize={11} width={90} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="count" name="Creators" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ChartShell>
  );
}

export function CampaignRoiChart({ data }: { data: { name: string; roi: number }[] }) {
  return (
    <ChartShell title="Campaign ROI">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="roi" name="ROI %" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartShell>
  );
}

export function MonthlyCollaborationsChart({ data }: { data: { month: string; collaborations: number }[] }) {
  return (
    <ChartShell title="Monthly Collaborations">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="collaborations"
          name="Collaborations"
          stroke="var(--color-chart-3)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ChartShell>
  );
}

export function TopNichesChart({ data }: { data: { niche: string; count: number }[] }) {
  return (
    <ChartShell title="Top Niches">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis dataKey="niche" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="count" name="Creators" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartShell>
  );
}

export function AverageScoreByNicheChart({ data }: { data: { niche: string; averageScore: number }[] }) {
  return (
    <ChartShell title="Average Score by Niche">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
        <XAxis dataKey="niche" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-muted)" }} />
        <Bar dataKey="averageScore" name="Avg Score" fill="var(--color-chart-5)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartShell>
  );
}
