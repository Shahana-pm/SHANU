"use client"

import Link from "next/link";
import { LogOut, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@/firebase";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function UserNav() {
    const { user, loading } = useUser();
    const auth = useAuth();
  
    if (loading) {
      return <Button variant="ghost" size="icon" disabled><User className="h-5 w-5" /></Button>
    }
  
    if (!user) {
      return (
        <Button variant="ghost" size="icon" asChild>
          <Link href="/login">
            <User className="h-5 w-5" />
            <span className="sr-only">Login</span>
          </Link>
        </Button>
      );
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => auth && auth.signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export function SiteHeader() {
  const { state } = useCart();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(state.items.reduce((acc, item) => acc + item.quantity, 0));
  }, [state.items]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1 items-center hidden md:flex">
            <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link
                href="/chairs"
                className="transition-colors hover:text-foreground/80"
                >
                Chairs
                </Link>
                <Link
                href="/sofas"
                className="transition-colors hover:text-foreground/80"
                >
                Sofas
                </Link>
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
                Lighting
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
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
