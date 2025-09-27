import { AiDescriptionForm } from "@/components/admin/ai-description-form";

export default function AiDescriptionGeneratorPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">AI Product Description Tool</h1>
        <p className="text-muted-foreground mt-1">
          Use the power of AI to generate compelling product titles, descriptions, and SEO keywords.
        </p>
      </div>
      <AiDescriptionForm />
    </div>
  );
}
