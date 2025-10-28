'use client';

import { usePathname } from 'next/navigation';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { Footer } from '@/components/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on an admin page
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {children}
      {/* Only show Footer and WhatsAppFloat on non-admin pages */}
      {!isAdminPage && (
        <>
          <Footer />
          <WhatsAppFloat />
        </>
      )}
    </>
  );
}

