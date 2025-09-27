"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  product: Product;
  variants: ProductVariant[];
}

export function ProductGallery({ product, variants }: ProductGalleryProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id
  );

  const selectedVariant = useMemo(() => variants.find(v => v.id === selectedVariantId), [variants, selectedVariantId]);

  const mainImage = selectedVariant?.imageUrl;

  if (!variants || variants.length === 0 || !mainImage) {
    return (
      <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg bg-secondary flex items-center justify-center">
          <span className="text-muted-foreground">No Image Available</span>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[80px_1fr] gap-4">
       <div className="flex md:flex-col gap-2">
        {/* Thumbnail functionality can be expanded if variants have multiple images */}
      </div>
       <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg bg-secondary">
          {mainImage && (
            <Image
              src={mainImage}
              alt={`${product.name} - ${selectedVariant?.color}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          )}
        </div>
    </div>
  );
}
