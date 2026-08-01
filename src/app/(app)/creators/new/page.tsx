import { CreatorForm } from "@/components/creators/creator-form";

export default function NewCreatorPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add Creator</h1>
        <p className="text-sm text-muted-foreground">Add a new creator to your database in under 2 minutes.</p>
      </div>
      <CreatorForm />
    </div>
  );
}
