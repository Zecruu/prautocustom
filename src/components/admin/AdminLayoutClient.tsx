'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

interface AdminLayoutClientProps {
  userRole: 'admin' | 'employee' | 'client';
  userName: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({ userRole, userName, children }: AdminLayoutClientProps) {
  // Initialize with true, but will be updated from localStorage if available
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    console.log('Saved sidebar state:', savedState);
    if (savedState !== null) {
      setIsSidebarOpen(savedState === 'true');
    } else {
      // Default to open on first load
      setIsSidebarOpen(true);
    }
  }, []);

  // Save sidebar state to localStorage whenever it changes
  const handleSetSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
    localStorage.setItem('sidebarOpen', String(open));
  };

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

