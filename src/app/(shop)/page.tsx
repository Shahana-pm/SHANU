'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { Product } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";

export default function HomePage() {
  const firestore = useFirestore();

  const productsRef = useMemo(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  
  const trendingQuery = useMemo(() => productsRef ? query(productsRef, where('isTrending', '==', true)) : null, [productsRef]);
  const { data: trendingProducts } = useCollection<Product>(trendingQuery);
  
  const newQuery = useMemo(() => productsRef ? query(productsRef, where('isNew', '==', true)) : null, [productsRef]);
  const { data: newCollection } = useCollection<Product>(newQuery);

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
          {trendingProducts?.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-16 md:py-24">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-headline text-3xl font-bold md:text-4xl">New Collection</h2>
                <Button variant="ghost" asChild>
                    <Link href="/products">View All <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {newCollection?.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </div>
      </section>
    </>
  );
}
