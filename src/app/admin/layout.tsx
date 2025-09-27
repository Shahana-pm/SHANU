import { AdminNav } from "@/components/admin-nav";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
            <AdminNav />
        </Sidebar>
        <SidebarInset>
            <main className="flex-1 p-8 bg-muted/40">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
