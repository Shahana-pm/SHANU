'use client';
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { useFirestore } from "@/firebase";
import { Product } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    const fetchProduct = async () => {
      const docRef = doc(firestore, "products", params.slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchProduct();
  }, [firestore, params.slug]);

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
