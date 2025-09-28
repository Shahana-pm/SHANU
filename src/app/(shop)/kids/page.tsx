
'use client';
import { ProductCard } from "@/components/product-card";
import { useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useProductsWithFirstVariant } from "@/hooks/use-products-with-first-variant";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemoFirebase } from "@/hooks/use-memo-firebase";

export default function KidsPage() {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "products"), where("category", "==", "Kids"));
  }, [firestore]);

  const { productsWithImages, loading } = useProductsWithFirstVariant(productsQuery);

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">For the Kids</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Stylish and fun items for the little ones.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/5] w-full rounded-lg"/>
              <Skeleton className="h-4 w-1/4 rounded"/>
              <Skeleton className="h-6 w-3/4 rounded"/>
              <Skeleton className="h-6 w-1/3 rounded"/>
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
