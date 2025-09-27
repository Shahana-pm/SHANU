'use client';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRight } from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { Product, ProductVariant } from "@/lib/types";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";

type ProductWithFirstVariant = Product & { firstVariantImageId?: string };

// Helper hook to fetch first variant image for a list of products
function useProductVariantImages(products: Product[] | null) {
  const firestore = useFirestore();
  const [productsWithImages, setProductsWithImages] = useState<ProductWithFirstVariant[]>([]);

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
              return { ...product, firstVariantImageId: firstVariant.imageIds[0] };
            }
            return product;
          })
        );
        setProductsWithImages(productsWithVariants);
      } else if(products) {
        setProductsWithImages(products);
      }
    };

    fetchVariants();
  }, [products, firestore]);

  return productsWithImages;
}


export default function HomePage() {
  const firestore = useFirestore();

  const productsRef = useMemo(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  
  const trendingQuery = useMemo(() => productsRef ? query(productsRef, where('isTrending', '==', true), limit(4)) : null, [productsRef]);
  const { data: trendingProducts } = useCollection<Product>(trendingQuery);
  
  const newQuery = useMemo(() => productsRef ? query(productsRef, where('isNew', '==', true), limit(4)) : null, [productsRef]);
  const { data: newCollectionProducts } = useCollection<Product>(newQuery);

  const trendingProductsWithImages = useProductVariantImages(trendingProducts);
  const newCollectionWithImages = useProductVariantImages(newCollectionProducts);


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
          {trendingProductsWithImages?.map(product => (
            <ProductCard key={product.id} product={product} variantImageId={product.firstVariantImageId} />
          ))}
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
            {newCollectionWithImages?.map(product => (
                <ProductCard key={product.id} product={product} variantImageId={product.firstVariantImageId} />
            ))}
            </div>
        </div>
      </section>
    </>
  );
}
