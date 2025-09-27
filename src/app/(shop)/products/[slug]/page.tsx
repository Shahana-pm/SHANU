
'use client';
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product-gallery";
import { ProductInfo } from "@/components/product-info";
import { useDoc, useFirestore, useCollection } from "@/firebase";
import { Product, ProductVariant, ProductReview } from "@/lib/types";
import { doc, collection } from "firebase/firestore";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";


function ProductPageSkeleton() {
  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="grid md:grid-cols-[80px_1fr] gap-4">
            <div/>
            <Skeleton className="aspect-[3/4] w-full rounded-lg"/>
        </div>
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
             <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-32 rounded-md" />
                <Skeleton className="h-12 flex-1 rounded-md" />
            </div>
        </div>
      </div>
    </div>
  )
}


export default function ProductPage({ params }: { params: { slug: string } }) {
  const firestore = useFirestore();
  const { slug } = params;

  const productRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "products", slug);
  }, [firestore, slug]);

  const variantsRef = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "products", slug, "variants");
  }, [firestore, slug]);

  const reviewsRef = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, "products", slug, "reviews");
  }, [firestore, slug]);

  const { data: product, loading: productLoading } = useDoc<Product>(productRef);
  const { data: variants, loading: variantsLoading } = useCollection<ProductVariant>(variantsRef);
  const { data: reviews, loading: reviewsLoading } = useCollection<ProductReview>(reviewsRef);

  const loading = productLoading || variantsLoading || reviewsLoading;

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductGallery product={product} variants={variants || []} />
        <ProductInfo product={product} variants={variants || []} reviews={reviews || []} />
      </div>
    </div>
  );
}
