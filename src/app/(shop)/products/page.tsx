'use client';
import { ProductCard } from "@/components/product-card";
import { useCollection, useFirestore } from "@/firebase";
import { Product, ProductVariant } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import { useMemo, useEffect, useState } from "react";

type ProductWithFirstVariant = Product & { firstVariantImageId?: string };

export default function ProductsPage() {
  const firestore = useFirestore();
  const [productsWithImages, setProductsWithImages] = useState<ProductWithFirstVariant[]>([]);

  const productsCollection = useMemo(() => firestore ? collection(firestore, "products") : null, [firestore]);
  const { data: products, loading } = useCollection<Product>(productsCollection);

  useEffect(() => {
    const fetchVariants = async () => {
      if (products && firestore) {
        const productsWithVariants = await Promise.all(
          products.map(async (product) => {
            const variantsRef = collection(firestore, 'products', product.id, 'variants');
            const variantsSnap = await getDocs(variantsRef);
            if (!variantsSnap.empty) {
              const firstVariant = variantsSnap.docs[0].data() as ProductVariant;
              return { ...product, firstVariantImageId: firstVariant.imageIds[0] };
            }
            return product;
          })
        );
        setProductsWithImages(productsWithVariants);
      }
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
            <p>Loading products...</p>
        ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productsWithImages.map((product) => (
                <ProductCard key={product.id} product={product} variantImageId={product.firstVariantImageId} />
                ))}
            </div>
        )}
    </div>
  );
}
