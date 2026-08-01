import { notFound } from "next/navigation";

import { getCreator } from "@/actions/creators";
import { CreatorForm } from "@/components/creators/creator-form";
import { creatorToFormValues } from "@/lib/validations/creator";

export default async function EditCreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = await getCreator(id);
  if (!creator) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit {creator.name}</h1>
        <p className="text-sm text-muted-foreground">Update creator details.</p>
      </div>
      <CreatorForm creatorId={creator.id} defaultValues={creatorToFormValues(creator)} />
    </div>
  );
}
