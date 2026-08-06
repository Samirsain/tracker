"use client";

import * as React from "react";
import { FileSpreadsheet, FileText, Printer, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  labelFor,
  NICHE_OPTIONS,
  CREATOR_TYPE_OPTIONS,
  COLLABORATION_CATEGORY_OPTIONS,
  PLATFORM_OPTIONS,
  RELATIONSHIP_STAGE_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/constants";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

export type CreatorExportRow = {
  name: string;
  instagramUsername: string | null;
  platform: string;
  niche: string;
  creatorType?: string | null;
  collaborationCategory?: string | null;
  followers: number;
  engagementRate: number;
  totalScore: number;
  grade: string | null;
  recommendation: string | null;
  relationshipStage: string;
  status: string;
  email: string | null;
  phone: string | null;
  monthlyRetainer?: number | null;
  couponCode?: string | null;
};

function toCsv(rows: CreatorExportRow[]) {
  const headers = [
    "Name",
    "Username",
    "Platform",
    "Creator Type",
    "Niche",
    "Collaboration Model",
    "Followers",
    "Engagement Rate",
    "Score",
    "Grade",
    "Recommendation",
    "Relationship Stage",
    "Status",
    "Monthly Retainer",
    "Coupon Code",
    "Email",
    "Phone",
  ];

  const escape = (value: string | number | null | undefined) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const lines = rows.map((row) =>
    [
      row.name,
      row.instagramUsername,
      labelFor(PLATFORM_OPTIONS, row.platform),
      labelFor(CREATOR_TYPE_OPTIONS, row.creatorType || "LIFESTYLE"),
      labelFor(NICHE_OPTIONS, row.niche),
      labelFor(COLLABORATION_CATEGORY_OPTIONS, row.collaborationCategory || "BARTER"),
      row.followers,
      `${row.engagementRate.toFixed(1)}%`,
      Math.round(row.totalScore),
      row.grade,
      row.recommendation,
      labelFor(RELATIONSHIP_STAGE_OPTIONS, row.relationshipStage),
      labelFor(STATUS_OPTIONS, row.status),
      row.monthlyRetainer ? `$${row.monthlyRetainer}` : "",
      row.couponCode,
      row.email,
      row.phone,
    ]
      .map(escape)
      .join(",")
  );

  return [headers.map(escape).join(","), ...lines].join("\n");
}

export function ExportActions({ creators }: { creators: CreatorExportRow[] }) {
  function downloadCsv() {
    const csv = toCsv(creators);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `creators-prd-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV export downloaded successfully");
  }

  function downloadExcel() {
    // Generates an Excel-compatible TSV/CSV format
    const csv = toCsv(creators);
    const blob = new Blob([csv], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `creators-prd-report-${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Excel report downloaded successfully");
  }

  function handlePrint() {
    toast.info("Preparing print-friendly report...");
    setTimeout(() => {
      window.print();
    }, 200);
  }

  return (
    <div className="space-y-6">
      {/* Printable CSS Rules */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report-area,
          #printable-report-area * {
            visibility: visible;
          }
          #printable-report-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          header, aside, nav, button {
            display: none !important;
          }
        }
      `}</style>

      {/* Export Actions Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4 text-emerald-500" /> CSV Export
            </CardTitle>
            <CardDescription>Export complete creator CRM data with PRD fields in CSV format.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={downloadCsv}>
              Download CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="h-4 w-4 text-green-600" /> Excel Sheet
            </CardTitle>
            <CardDescription>Export formatted Excel workbook (.xls) with all metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={downloadExcel}>
              Export Excel
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-rose-500" /> PDF Document
            </CardTitle>
            <CardDescription>Save or print report directly as a clean PDF document.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handlePrint}>
              Save as PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Printer className="h-4 w-4 text-violet-500" /> Print Summary
            </CardTitle>
            <CardDescription>Print clean summary report table directly.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handlePrint}>
              Print Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Printable & Visible Live Report Preview Table */}
      <div id="printable-report-area" className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Sacred Habit — Creator CRM Report</h2>
            <p className="text-xs text-muted-foreground">
              Generated on {new Date().toLocaleDateString("en-US", { dateStyle: "full" })} • Total Creators: {creators.length}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Confidential Brand Report</p>
            <p>PRD Version 1.0</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Creator Name</TableHead>
                <TableHead>Handle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Niche</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Followers</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Coupon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creators.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-medium text-sm">{c.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">@{c.instagramUsername || "-"}</TableCell>
                  <TableCell className="text-xs">{labelFor(CREATOR_TYPE_OPTIONS, c.creatorType || "LIFESTYLE")}</TableCell>
                  <TableCell className="text-xs">{labelFor(NICHE_OPTIONS, c.niche)}</TableCell>
                  <TableCell className="text-xs font-medium">{labelFor(COLLABORATION_CATEGORY_OPTIONS, c.collaborationCategory || "BARTER")}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums font-semibold">{formatCompactNumber(c.followers)}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums">{c.engagementRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right text-xs font-bold">{Math.round(c.totalScore)}/100</TableCell>
                  <TableCell className="text-xs">{labelFor(RELATIONSHIP_STAGE_OPTIONS, c.relationshipStage)}</TableCell>
                  <TableCell className="text-xs font-mono">{c.couponCode || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
