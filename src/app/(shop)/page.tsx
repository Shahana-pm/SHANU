'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import { useFirestore, useCollection } from "@/firebase";
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

export default function HomePage() {
  const firestore = useFirestore();

  const productsRef = useMemo(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  
  const trendingQuery = useMemo(() => productsRef ? query(productsRef, where('isTrending', '==', true), limit(4)) : null, [productsRef]);
  const { productsWithImages: trendingProducts, loading: trendingLoading } = useProductsWithFirstVariant(trendingQuery);
  
  const newQuery = useMemo(() => productsRef ? query(productsRef, where('isNew', '==', true), limit(4)) : null, [productsRef]);
  const { productsWithImages: newCollection, loading: newLoading } = useProductsWithFirstVariant(newQuery);

  return (
    <>
      <section className="relative h-[60vh] min-h-[500px] w-full">
        <Image 
          src="https://picsum.photos/seed/hero/1800/1000" 
          alt="Modern living room"
          fill
          className="object-cover"
          priority
          data-ai-hint="modern living room"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative flex h-full items-center justify-center text-center text-white">
          <div className="max-w-2xl">
            <h1 className="font-headline text-4xl font-bold sm:text-5xl md:text-6xl">Design Your Space</h1>
            <p className="mt-4 text-lg text-white/80">Discover furniture and decor that bring your vision to life. Smart, stylish, and sustainable.</p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5"/></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="flex items-center justify-between mb-8">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Trending Products</h2>
            <Button variant="ghost" asChild>
                <Link href="/products">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trendingLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[4/5] w-full bg-muted animate-pulse rounded-lg"/>
                  <div className="h-4 w-1/4 bg-muted animate-pulse rounded"/>
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded"/>
                  <div className="h-6 w-1/3 bg-muted animate-pulse rounded"/>
                </div>
              ))
          ) : (
            trendingProducts?.map(product => (
              <ProductCard key={product.id} product={product} variantImageUrl={product.firstVariantImageUrl} />
            ))
          )}
        </div>
      </section>

      <section className="bg-secondary/50">
        <div className="container py-16 md:py-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-headline text-3xl font-bold md:text-4xl">New Collection</h2>
                <Button variant="ghost" asChild>
                    <Link href="/products">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newLoading ? (
               Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="aspect-[4/5] w-full bg-muted animate-pulse rounded-lg"/>
                  <div className="h-4 w-1/4 bg-muted animate-pulse rounded"/>
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded"/>
                  <div className="h-6 w-1/3 bg-muted animate-pulse rounded"/>
                </div>
              ))
            ) : (
                newCollection?.map(product => (
                    <ProductCard key={product.id} product={product} variantImageUrl={product.firstVariantImageUrl} />
                ))
            )}
            </div>
        </div>
      </section>
    </>
  );
}
