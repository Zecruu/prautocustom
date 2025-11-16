'use client';

import { usePathname } from 'next/navigation';
import { FloatingActions } from '@/components/ui/FloatingActions';
import { Footer } from '@/components/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {children}
      {/* Only show Footer and FloatingActions on non-admin pages */}
      {!isAdminPage && (
        <>
          <Footer />
          <FloatingActions />
        </>
      )}
    </>
  );
}

