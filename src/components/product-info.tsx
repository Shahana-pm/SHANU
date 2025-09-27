"use client";

import { useState, useMemo } from "react";
import type { Product, ProductVariant, ProductReview } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface ProductInfoProps {
  product: Product;
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export function ProductInfo({ product, variants, reviews }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id
  );
  const { dispatch } = useCart();
  const { toast } = useToast();

  const selectedVariant = useMemo(() => variants.find(
    (v) => v.id === selectedVariantId
  )!, [variants, selectedVariantId]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast({
        variant: "destructive",
        title: "Please select a variant",
        description: "This product does not have a default variant.",
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
        <p className="text-3xl font-semibold">${product.price.toFixed(2)}</p>
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

      <p className="text-3xl font-semibold">${product.price.toFixed(2)}</p>

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
