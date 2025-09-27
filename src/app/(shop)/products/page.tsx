'use client';
import { ProductCard } from "@/components/product-card";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/lib/types";

type ProductWithFirstVariant = Product & { firstVariantImageUrl?: ProductVariant['imageUrl'] };

function useProductsWithFirstVariant(productsQuery: query | null) {
  const firestore = useFirestore();
  const { data: products, loading: productsLoading, error: productsError } = useCollection<Product>(productsQuery);

  const [productsWithImages, setProductsWithImages] = useState<ProductWithFirstVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariants = async () => {
      if (products && firestore) {
        const productsWithVariants = await Promise.all(
          products.map(async (product) => {
            const variantsRef = collection(firestore, 'products', product.id, 'variants');
            const q = query(variantsRef, limit(1));
            const variantsSnap = await getDocs(q);
            if (!variantsSnap.empty) {
              const firstVariant = variantsSnap.docs[0].data() as ProductVariant;
              return { ...product, firstVariantImageUrl: firstVariant.imageUrl };
            }
            return product;
          })
        );
        setProductsWithImages(productsWithVariants);
        setLoading(false);
      } else if (!productsLoading) {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [products, firestore, productsLoading]);

  return { productsWithImages, loading: loading || productsLoading, error: productsError };
}

export default function ProductsPage() {
  const firestore = useFirestore();
  
  const productsCollection = useMemo(() => firestore ? collection(firestore, "products") : null, [firestore]);

  const { productsWithImages, loading } = useProductsWithFirstVariant(productsCollection);

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore our curated collection of modern and stylish products for your home.
        </p>
      </div>
        {loading ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
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
