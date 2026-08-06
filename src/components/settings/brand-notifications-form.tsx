"use client";

import * as React from "react";
import { Bell, Building2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BrandAndNotificationSettings() {
  const [brandName, setBrandName] = React.useState("Sacred Habit");
  const [category, setCategory] = React.useState("Health, Wellness & Nutrition");
  const [website, setWebsite] = React.useState("https://sacredhabit.com");
  const [currency, setCurrency] = React.useState("INR");

  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [followUpReminders, setFollowUpReminders] = React.useState(true);
  const [weeklySummaries, setWeeklySummaries] = React.useState(true);

  function handleSaveBrand(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Brand settings updated successfully!");
  }

  function handleSaveNotifications(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Notification preferences saved!");
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Brand Settings */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" /> Brand Identity
          </CardTitle>
          <CardDescription>Company branding and default currency preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveBrand} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Brand Name</Label>
              <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Brand Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Official Website</Label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Default Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹) — Indian Rupee</SelectItem>
                  <SelectItem value="USD">USD ($) — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR (€) — Euro</SelectItem>
                  <SelectItem value="GBP">GBP (£) — British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="sm" className="w-full">
              <Save className="h-3.5 w-3.5 mr-1" /> Save Brand Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-emerald-500" /> Notification & Alerts
          </CardTitle>
          <CardDescription>Manage automated CRM alerts and follow-up emails.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveNotifications} className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Ambassador Alerts</Label>
                <p className="text-xs text-muted-foreground">Notify when a creator scores ≥ 90 (Founding Ambassador)</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Follow-Up Reminders</Label>
                <p className="text-xs text-muted-foreground">Daily notifications for scheduled creator follow-ups</p>
              </div>
              <Switch checked={followUpReminders} onCheckedChange={setFollowUpReminders} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Weekly Campaign Digest</Label>
                <p className="text-xs text-muted-foreground">Receive weekly automated ROAS & sales performance summary</p>
              </div>
              <Switch checked={weeklySummaries} onCheckedChange={setWeeklySummaries} />
            </div>

            <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              AI Automated notifications enabled for high-priority creator deals.
            </div>

            <Button type="submit" size="sm" variant="outline" className="w-full">
              <Save className="h-3.5 w-3.5 mr-1" /> Save Notification Preferences
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
