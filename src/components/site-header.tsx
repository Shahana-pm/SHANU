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

  const itemCount = isClient ? state.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-16 grid-cols-3 items-center">
        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/products" className="transition-colors hover:text-foreground/80">
            Products
          </Link>
          <Link href="/hair-accessories" className="transition-colors hover:text-foreground/80">
            Hair Accessories
          </Link>
          <Link href="/dresses" className="transition-colors hover:text-foreground/80">
            Dresses
          </Link>
          <Link href="/kids" className="transition-colors hover:text-foreground/80">
            Kids
          </Link>
        </nav>
        <div className="flex justify-center">
            <Link href="/" className="text-2xl font-bold font-headline">
                IQRAH SHANU
            </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin">
              <User className="h-5 w-5" />
              <span className="sr-only">User Account</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
