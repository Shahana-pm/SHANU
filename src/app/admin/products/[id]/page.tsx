'use client';
import { notFound } from "next/navigation";
import { useFirestore } from "@/firebase";
import { Product } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import EditProductForm from "./edit-product-form";

export default function AdminProductEditPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    const fetchProduct = async () => {
      const docRef = doc(firestore, "products", params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchProduct();
  }, [firestore, params.id]);

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
