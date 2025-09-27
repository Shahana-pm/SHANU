"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  return (
    <div className="flex flex-col gap-8">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg bg-secondary">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={`${product.name} - ${selectedVariant?.color} view ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
            <>
                <CarouselPrevious className="left-4"/>
                <CarouselNext className="right-4"/>
            </>
        )}
      </Carousel>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Color: {selectedVariant?.color}</h3>
        <div className="flex items-center gap-2 mt-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariantId(variant.id)}
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
