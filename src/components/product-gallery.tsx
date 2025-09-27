"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0].id
  );

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );
  const images =
    selectedVariant?.imageIds
      .map((id) => PlaceHolderImages.find((img) => img.id === id))
      .filter(Boolean) ?? [];

  const [mainImage, setMainImage] = useState(images[0]);

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    const newVariant = product.variants.find((v) => v.id === variantId);
    const newImages = newVariant?.imageIds
      .map((id) => PlaceHolderImages.find((img) => img.id === id))
      .filter(Boolean) ?? [];
    setMainImage(newImages[0]);
  }

  return (
    <div className="grid grid-cols-1 gap-4">
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
      <div className="flex gap-2">
        {images.map((image, index) => (
          image && <button
            key={image.id}
            className={cn(
              "relative aspect-square w-full max-w-[80px] overflow-hidden rounded-md bg-secondary transition-all",
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

      <div>
          <h3 className="text-sm font-medium text-muted-foreground">Color: {selectedVariant?.color}</h3>
          <div className="flex items-center gap-2 mt-2">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleVariantChange(variant.id)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-transform duration-200 ease-in-out",
                  selectedVariantId === variant.id
                    ? "border-primary scale-110"
                    : "border-transparent"
                )}
                aria-label={`Select color ${variant.color}`}
              >
                <span
                  className="block h-full w-full rounded-full border border-border"
                  style={{ backgroundColor: variant.colorHex }}
                />
              </button>
            ))}
          </div>
        </div>
    </div>
  );
}
