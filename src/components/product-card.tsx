import Link from "next/link";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore } from "@/firebase";
import { collection, limit, query } from "firebase/firestore";
import { useMemo } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const firestore = useFirestore();

  const variantsRef = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products', product.id, 'variants'), limit(1));
  }, [firestore, product.id]);

  const { data: variants } = useCollection<ProductVariant>(variantsRef);

  const firstVariant = variants?.[0];
  const firstVariantImageId = firstVariant?.imageIds[0];
  const image = PlaceHolderImages.find(img => img.id === firstVariantImageId);

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="overflow-hidden rounded-lg">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
          {image ? (
            <Image
              src={image.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
          ) : (
            <div className="w-full h-full bg-secondary"/>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <Badge variant="default">New</Badge>}
            {product.isTrending && <Badge variant="secondary">Trending</Badge>}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-foreground/80">{product.category}</h3>
        <p className="mt-1 font-semibold">{product.name}</p>
        <p className="mt-2 text-lg font-semibold">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
