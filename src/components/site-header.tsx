"use client"

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { state } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1 items-center hidden md:flex">
            <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link
                href="/dresses"
                className="transition-colors hover:text-foreground/80"
                >
                Dresses
                </Link>
                <Link
                href="/hair-accessories"
                className="transition-colors hover:text-foreground/80"
                >
                Hair Accessories
                </Link>
                <Link
                href="/kids"
                className="transition-colors hover:text-foreground/80"
                >
                Kids
                </Link>
            </nav>
        </div>

        <div className="flex-1 flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold sm:inline-block font-headline text-lg">
                IQRAH SHANU
                </span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5" />
              {isClient && itemCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
