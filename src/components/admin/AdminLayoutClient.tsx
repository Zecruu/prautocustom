'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

interface AdminLayoutClientProps {
  userRole: 'admin' | 'employee' | 'client';
  userName: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({ userRole, userName, children }: AdminLayoutClientProps) {
  // Track if component has mounted (for hydration safety)
  const [hasMounted, setHasMounted] = useState(false);
  // Initialize sidebar as open - will be updated from localStorage after mount
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Set mounted state and load sidebar preference from localStorage
  useEffect(() => {
    setHasMounted(true);
    const savedState = localStorage.getItem('sidebarOpen');
    console.log('AdminLayoutClient mounted. Saved sidebar state:', savedState);
    if (savedState !== null) {
      setIsSidebarOpen(savedState === 'true');
    } else {
      // Default to open on first load and save it
      setIsSidebarOpen(true);
      localStorage.setItem('sidebarOpen', 'true');
    }
  }, []);

  // Save sidebar state to localStorage whenever it changes
  const handleSetSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
    localStorage.setItem('sidebarOpen', String(open));
  };

  // During SSR/initial hydration, show loading state to avoid mismatch
  if (!hasMounted) {
    return (
      <div className="relative h-screen bg-black overflow-hidden">
        <div className="h-full overflow-y-auto lg:ml-64">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <Sidebar
        userRole={userRole}
        userName={userName}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={handleSetSidebarOpen}
      />
      <main
        className={`h-full overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

