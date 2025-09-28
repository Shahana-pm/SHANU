
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const handleQuantityChange = (
    productId: string,
    variantId: string,
    quantity: number
  ) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, variantId, quantity },
    });
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } });
  };

  const subtotal = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="container py-12">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>
      {state.items.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item) => {
              return (
                <div key={`${item.productId}-${item.variantId}`} className="flex flex-col sm:flex-row gap-4">
                  <div className="relative h-32 w-32 sm:h-24 sm:w-24 self-center overflow-hidden rounded-md bg-secondary">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                      <p className="text-sm font-medium">Rs{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start gap-4">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            item.variantId,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-20 h-10 text-center"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveItem(item.productId, item.variantId)
                        }
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="space-y-6">
            <h2 className="font-headline text-2xl font-bold">Order Summary</h2>
            <div className="space-y-2 p-6 bg-secondary rounded-lg">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                </div>
                <Separator className="my-4"/>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>Rs{subtotal.toFixed(2)}</span>
                </div>
            </div>
            <Button size="lg" className="w-full" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
