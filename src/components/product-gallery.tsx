
"use client";

import { use, useMemo, useContext, useEffect } from "react";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SelectedVariantContext } from "@/app/(shop)/products/[slug]/selected-variant-context.tsx";
import { type SelectedVariantContextType } from "@/app/(shop)/products/[slug]/selected-variant-context.tsx";

interface ProductGalleryProps {
  product: Product;
  variants: ProductVariant[];
}

export function ProductGallery({ product, variants }: ProductGalleryProps) {
  const context = useContext(SelectedVariantContext);
  if (!context) {
    throw new Error("ProductGallery must be used within a SelectedVariantProvider");
  }
  const { selectedVariantId, setSelectedVariantId } = context;


  useEffect(() => {
    if (!selectedVariantId && variants.length > 0) {
      setSelectedVariantId(variants[0].id);
    }
  }, [selectedVariantId, variants, setSelectedVariantId]);

  const selectedVariant = useMemo(() => {
    return variants.find(v => v.id === selectedVariantId);
  }, [variants, selectedVariantId]);

  const mainImage = selectedVariant?.imageUrl;

  if (!variants || variants.length === 0) {
    return (
      <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg bg-secondary flex items-center justify-center">
          <span className="text-muted-foreground">No Image Available</span>
      </div>
    )
  }
  
  if (!mainImage) {
    return (
        <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg bg-secondary flex items-center justify-center">
             <span className="text-muted-foreground">Image not found</span>
        </div>
      )
  }

  return (
    <div className="grid md:grid-cols-[80px_1fr] gap-4">
       <div className="flex md:flex-col gap-2">
        {variants.map(variant => (
           <button 
             key={variant.id} 
             className={cn(
               "relative aspect-square h-20 w-20 overflow-hidden rounded-md transition-opacity hover:opacity-100",
                selectedVariantId === variant.id ? "opacity-100 ring-2 ring-primary ring-offset-2" : "opacity-75"
             )}
             onClick={() => setSelectedVariantId(variant.id)}
           >
              <Image 
                src={variant.imageUrl} 
                alt={`${product.name} - ${variant.color}`} 
                fill
                sizes="80px"
                className="object-cover"
              />
           </button>
        ))}
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
