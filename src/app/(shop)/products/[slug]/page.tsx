'use client';
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { useDoc, useFirestore } from "@/firebase";
import { Product } from "@/lib/types";
import { doc } from "firebase/firestore";
import { useMemo } from "react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const firestore = useFirestore();

  const productRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "products", params.slug);
  }, [firestore, params.slug]);

  const { data: product, loading } = useDoc<Product>(productRef);

  if (loading) {
    return <div className="container py-8 md:py-12">Loading...</div>;
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>
    </div>
  );
}
