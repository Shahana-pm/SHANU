'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import { useFirestore } from "@/firebase";
import { Product } from "@/lib/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newCollection, setNewCollection] = useState<Product[]>([]);
  const firestore = useFirestore();

  useEffect(() => {
    if (!firestore) return;
    
    const fetchProducts = async () => {
      const productsRef = collection(firestore, 'products');

      // Fetch trending products
      const trendingQuery = query(productsRef, where('isTrending', '==', true));
      const trendingSnapshot = await getDocs(trendingQuery);
      setTrendingProducts(trendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)).slice(0, 4));

      // Fetch new collection
      const newQuery = query(productsRef, where('isNew', '==', true));
      const newSnapshot = await getDocs(newQuery);
      setNewCollection(newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)).slice(0, 4));
    };

    fetchProducts();
  }, [firestore]);


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
          {trendingProducts.map(product => (
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
            {newCollection.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        </div>
      </section>
    </>
  );
}
