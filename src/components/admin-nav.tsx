"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Users, Bot, ExternalLink } from "lucide-react";

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
    <nav className="p-4 space-y-2 flex flex-col h-full">
      <div>
        <Link href="/admin" className="text-xl font-bold font-headline mb-4 block px-2">
          IQRAH SHANU
        </Link>
        <div className="space-y-1">
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
      </div>
      <div className="mt-auto">
        <Link
            href="/"
            target="_blank"
            className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted"
            )}
            >
            <ExternalLink className="h-4 w-4" />
            View Store
            </Link>
      </div>
    </nav>
  );
}
