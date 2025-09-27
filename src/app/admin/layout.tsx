import { AdminNav } from "@/components/admin-nav";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex min-h-screen">
        <div className="w-64 border-r bg-muted/40">
            <AdminNav />
        </div>
        <main className="flex-1 p-8">
            {children}
        </main>
      </div>
  );
}
