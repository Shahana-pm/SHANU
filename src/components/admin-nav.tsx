"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Users, Bot, ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/ai-description-generator", label: "AI Tool", icon: Bot },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full h-full flex flex-col">
      <div className="h-16 border-b flex items-center justify-center px-6">
        <Link href="/admin" className="text-xl font-bold font-headline">
          IQRAH SHANU
        </Link>
      </div>
      <div className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="p-4 border-t">
        <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
        </Link>
      </div>
    </nav>
  );
}
