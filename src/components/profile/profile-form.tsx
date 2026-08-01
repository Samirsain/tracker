"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Loader2, LogOut, Save } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/users";

export function ProfileForm({ name, email, role }: { name: string; email: string; role: string }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { register, handleSubmit } = useForm<{ name: string }>({ defaultValues: { name } });

  async function onSubmit(values: { name: string }) {
    setIsSubmitting(true);
    try {
      await updateProfile(values.name);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input {...register("name")} />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={email} disabled />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Input value={role === "ADMIN" ? "Admin" : "Team Member"} disabled />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
          Save Changes
        </Button>
      </form>

      <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut /> Sign out
      </Button>
    </div>
  );
}
