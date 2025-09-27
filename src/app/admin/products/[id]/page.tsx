'use client';
import { notFound } from "next/navigation";
import { useDoc, useFirestore } from "@/firebase";
import { Product } from "@/lib/types";
import { doc } from "firebase/firestore";
import { useMemo, use } from "react";
import EditProductForm from "./edit-product-form";

export default function AdminProductEditPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  // The 'params' object is a Promise-like object in recent Next.js versions.
  // We must use `use()` to unwrap its value in Client Components.
  const resolvedParams = use(Promise.resolve(params));
  const { id } = resolvedParams;
  
  const productRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, "products", id);
  }, [firestore, id]);

  const { data: product, loading } = useDoc<Product>(productRef);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-8">Edit: {product.name}</h1>
      <EditProductForm product={product} />
    </div>
  );
}
