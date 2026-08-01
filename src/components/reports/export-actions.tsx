"use client";

import { FileSpreadsheet, FileText, Printer, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { labelFor, NICHE_OPTIONS, PLATFORM_OPTIONS, RELATIONSHIP_STAGE_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";

type CreatorExportRow = {
  name: string;
  instagramUsername: string | null;
  platform: string;
  niche: string;
  followers: number;
  engagementRate: number;
  totalScore: number;
  grade: string | null;
  recommendation: string | null;
  relationshipStage: string;
  status: string;
  email: string | null;
  phone: string | null;
};

function toCsv(rows: CreatorExportRow[]) {
  const headers = [
    "Name",
    "Username",
    "Platform",
    "Niche",
    "Followers",
    "Engagement Rate",
    "Score",
    "Grade",
    "Recommendation",
    "Relationship Stage",
    "Status",
    "Email",
    "Phone",
  ];

  const escape = (value: string | number | null) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const lines = rows.map((row) =>
    [
      row.name,
      row.instagramUsername,
      labelFor(PLATFORM_OPTIONS, row.platform),
      labelFor(NICHE_OPTIONS, row.niche),
      row.followers,
      `${row.engagementRate.toFixed(1)}%`,
      Math.round(row.totalScore),
      row.grade,
      row.recommendation,
      labelFor(RELATIONSHIP_STAGE_OPTIONS, row.relationshipStage),
      labelFor(STATUS_OPTIONS, row.status),
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
    link.download = `creators-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV export downloaded");
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="h-4 w-4" /> CSV
          </CardTitle>
          <CardDescription>Export all creators as a spreadsheet-ready CSV file.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={downloadCsv}>
            Export CSV
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" /> PDF
          </CardTitle>
          <CardDescription>Generate a shareable PDF report.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => toast.info("PDF export is coming soon")}>
            Export PDF
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </CardTitle>
          <CardDescription>Export formatted Excel workbook.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => toast.info("Excel export is coming soon")}>
            Export Excel
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Printer className="h-4 w-4" /> Print
          </CardTitle>
          <CardDescription>Print-friendly summary view.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => window.print()}>
            Print
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
