import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const firstVariantImageId = product.variants[0]?.imageIds[0];
  const image = PlaceHolderImages.find(img => img.id === firstVariantImageId);

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="overflow-hidden rounded-lg">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
          {image && (
            <Image
              src={image.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
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
