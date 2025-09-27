import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/hair-accessories", label: "Hair Accessories" },
    { href: "/dresses", label: "Dresses" },
    { href: "/kids", label: "Kids" },
  ];

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
          <Sidebar>
            <div className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted"
                  >
                    {item.label}
                  </a>
                ))}
            </div>
          </Sidebar>
          <SidebarInset>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
