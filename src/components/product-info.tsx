
"use client";

import { useState, useMemo, useContext, useEffect } from "react";
import type { Product, ProductVariant, ProductReview } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { SelectedVariantContext, type SelectedVariantContextType } from "@/app/(shop)/products/[slug]/selected-variant-context.tsx";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export function ProductInfo({ product, variants, reviews }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const context = useContext(SelectedVariantContext);
  if (!context) {
    throw new Error("ProductInfo must be used within a SelectedVariantProvider");
  }
  const { selectedVariantId, setSelectedVariantId } = context;
  
  const { dispatch } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedVariantId && variants.length > 0) {
      setSelectedVariantId(variants[0].id);
    }
  }, [selectedVariantId, variants, setSelectedVariantId]);

  const selectedVariant = useMemo(() => {
    return variants.find((v) => v.id === selectedVariantId);
  }, [variants, selectedVariantId]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast({
        variant: "destructive",
        title: "Please select a variant",
        description: "You must select a color before adding to cart.",
      });
      return;
    }
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        price: product.price,
        name: product.name,
        color: selectedVariant.color,
        image: selectedVariant.imageUrl,
      },
    });
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} (${selectedVariant.color})`,
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  if (!variants || variants.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">
            {product.category}
          </p>
          <h1 className="font-headline text-3xl md:text-4xl font-bold mt-1">
            {product.name}
          </h1>
        </div>
        <p className="text-3xl font-semibold">Rs{product.price.toFixed(2)}</p>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
        <p className="text-destructive">This product is currently unavailable as it has no variants.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h1 className="font-headline text-3xl md:text-4xl font-bold mt-1">
          {product.name}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
            {Array.from({length: 5}).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
            ))}
        </div>
        <p className="text-sm text-muted-foreground">({reviews.length} reviews)</p>
      </div>

      <p className="text-3xl font-semibold">Rs{product.price.toFixed(2)}</p>

      <div>
        <h3 className="text-sm font-medium text-foreground">Color: <span className="text-muted-foreground">{selectedVariant?.color}</span></h3>
        <div className="flex items-center gap-2 mt-2">
            {variants.map(variant => (
                <button 
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={cn("h-8 w-8 rounded-full border-2 transition-transform transform hover:scale-110", selectedVariantId === variant.id ? "ring-2 ring-primary ring-offset-2" : "border-muted-foreground/50")}
                    style={{backgroundColor: variant.colorHex}}
                    aria-label={`Select color ${variant.color}`}
                />
            ))}
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </Button>
          <span className="w-10 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </Button>
        </div>
        <Button size="lg" className="flex-1" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
