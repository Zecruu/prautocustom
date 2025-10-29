'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

interface AdminLayoutClientProps {
  userRole: 'admin' | 'employee' | 'client';
  userName: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({ userRole, userName, children }: AdminLayoutClientProps) {
  // Start with sidebar closed on mobile, open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Set initial state based on screen size
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <Sidebar 
        userRole={userRole} 
        userName={userName}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
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

