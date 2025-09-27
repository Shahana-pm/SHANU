'use client';
import { ProductCard } from "@/components/product-card";
import { useCollection, useFirestore } from "@/firebase";
import { Product, ProductVariant } from "@/lib/types";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { useMemo, useEffect, useState } from "react";

type ProductWithFirstVariant = Product & { firstVariantImageUrl?: ProductVariant['imageUrl'] };

export default function ProductsPage() {
  const firestore = useFirestore();
  const [productsWithImages, setProductsWithImages] = useState<ProductWithFirstVariant[]>([]);
  const [loading, setLoading] = useState(true);

  const productsCollection = useMemo(() => firestore ? collection(firestore, "products") : null, [firestore]);
  const { data: products } = useCollection<Product>(productsCollection);

  useEffect(() => {
    const fetchVariants = async () => {
      setLoading(true);
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
      } else if (products) {
        setProductsWithImages(products)
      }
      setLoading(false);
    };

    fetchVariants();
  }, [products, firestore]);

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
