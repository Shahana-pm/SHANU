import { getProductById } from "@/lib/data";
import { notFound } from "next/navigation";

export default function AdminProductEditPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-8">Edit: {product.name}</h1>
      {/* Product edit form will go here */}
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">Product editing form coming soon!</p>
      </div>
    </div>
  );
}
