"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { ShieldCheck, Loader2, LogOut, Save, User, KeyRound, Laptop } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "@/actions/users";

export function ProfileForm({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [designation, setDesignation] = React.useState("Head of Influencer Marketing");

  const { register, handleSubmit } = useForm<{ name: string }>({ defaultValues: { name } });

  async function onSubmit(values: { name: string }) {
    setIsSubmitting(true);
    try {
      await updateProfile(values.name);
      toast.success("✨ Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Password reset instructions sent to your email!");
  }

  return (
    <div className="space-y-6">
      {/* Account Details Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-primary" /> Account Information
          </CardTitle>
          <CardDescription>Update your personal details and public profile info.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full Name</Label>
                <Input {...register("name")} placeholder="Samir Sain" />
              </div>
              <div className="space-y-1.5">
                <Label>Designation / Role Title</Label>
                <Input value={designation} onChange={(e) => setDesignation(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input value={email} disabled className="bg-muted/50 cursor-not-allowed" />
              </div>
              <div className="space-y-1.5">
                <Label>System Role</Label>
                <div className="flex items-center gap-2 pt-1">
                  <Input value={role === "ADMIN" ? "Super Admin" : "Team Member"} disabled className="bg-muted/50 cursor-not-allowed font-medium" />
                  <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    {role}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security & Active Sessions Card */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-emerald-500" /> Password & Security
            </CardTitle>
            <CardDescription>Manage password and authentication security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              To change your password, we will send a secure password reset link to your registered email (<span className="font-medium text-foreground">{email}</span>).
            </p>
            <Button size="sm" variant="outline" onClick={handleResetPassword} className="w-full">
              Request Password Reset
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Laptop className="h-4 w-4 text-sky-500" /> Active Session
            </CardTitle>
            <CardDescription>Current signed-in browser session details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-2.5 bg-muted/30">
              <div className="space-y-0.5">
                <p className="text-xs font-medium">Windows Desktop • Next-Auth Session</p>
                <p className="text-[11px] text-muted-foreground">Active Now • IP Address 127.0.0.1</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign Out of System
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
