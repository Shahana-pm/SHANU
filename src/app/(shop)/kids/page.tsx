'use client';
import { ProductCard } from "@/components/product-card";
import { useProductsWithImages } from "@/hooks/use-products-with-images";
import { useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";

export default function KidsPage() {
  const firestore = useFirestore();

  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"), where("category", "==", "Kids"));
  }, [firestore]);

  const { productsWithImages, loading } = useProductsWithImages(productsQuery);

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Kids Collection</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Adorable and comfortable styles for your little ones.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[4/5] w-full bg-muted animate-pulse rounded-lg"/>
              <div className="h-4 w-1/4 bg-muted animate-pulse rounded"/>
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded"/>
              <div className="h-6 w-1/3 bg-muted animate-pulse rounded"/>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsWithImages.map((product) => (
            <ProductCard key={product.id} product={product} variantImageUrl={product.firstVariantImageUrl} />
          ))}
        </div>
      )}
    </div>
  );
}
