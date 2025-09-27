import { getProductById } from "@/lib/data";
import { notFound } from "next/navigation";
import EditProductForm from "./edit-product-form";

export default function AdminProductEditPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-8">Edit: {product.name}</h1>
      <EditProductForm product={product} />
    </div>
  );
}
