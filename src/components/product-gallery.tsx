"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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

  const images = useMemo(() => 
    selectedVariant?.imageIds
      .map((id) => PlaceHolderImages.find((img) => img.id === id))
      .filter(Boolean) ?? []
  , [selectedVariant]);

  const [mainImage, setMainImage] = useState(images[0]);

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    const newVariant = variants.find((v) => v.id === variantId);
    const newImages = newVariant?.imageIds
      .map((id) => PlaceHolderImages.find((img) => img.id === id))
      .filter(Boolean) ?? [];
    setMainImage(newImages[0]);
  }

  if (!variants || variants.length === 0) {
    return (
      <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg bg-secondary">
          <Image
              src="https://placehold.co/800x1000"
              alt="Placeholder Image"
              fill
              className="object-cover"
            />
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[80px_1fr] gap-4">
      <div className="flex md:flex-col gap-2">
        {images.map((image, index) => (
          image && <button
            key={image.id}
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-md bg-secondary transition-all",
              mainImage?.id === image.id ? "ring-2 ring-primary ring-offset-2" : "opacity-75 hover:opacity-100"
            )}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image.imageUrl}
              alt={`${product.name} - thumbnail ${index + 1}`}
              fill
              sizes="80px"
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </button>
        ))}
      </div>
       <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg bg-secondary">
          {mainImage && (
            <Image
              src={mainImage.imageUrl}
              alt={`${product.name} - ${selectedVariant?.color}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              data-ai-hint={mainImage.imageHint}
              priority
            />
          )}
        </div>
    </div>
  );
}
