import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen flex-col">
          <Sidebar />
          <SidebarInset>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
