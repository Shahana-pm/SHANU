'use client';

import { notFound, useParams } from "next/navigation";
import { useDoc, useFirestore } from "@/firebase";
import { Product } from "@/lib/types";
import { doc } from "firebase/firestore";
import { useMemo } from "react";
import EditProductForm from "./edit-product-form";

export default function AdminProductEditPage() {
  const firestore = useFirestore();
  const params = useParams();
  const id = params.id as string;

  const productRef = useMemo(() => {
    if (!firestore || !id) return null;
    return doc(firestore, "products", id);
  }, [firestore, id]);

  const { data: product, loading } = useDoc<Product>(productRef);

  if (loading) {
    return (
      <div>
        <h1 className="font-headline text-3xl font-bold mb-8">Edit Product</h1>
        <p>Loading...</p>
      </div>
    );
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
