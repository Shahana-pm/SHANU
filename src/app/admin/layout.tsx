'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { AdminNav } from '@/components/admin-nav';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'shanupm6181@gmail.com';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
      <div className="flex min-h-screen">
        <div className="hidden w-64 border-r bg-muted/40 md:block">
            <AdminNav />
        </div>
        <main className="flex-1 p-8">
            {children}
        </main>
      </div>
  );
}
