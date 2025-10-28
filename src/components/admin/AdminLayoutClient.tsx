'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

interface AdminLayoutClientProps {
  userRole: 'admin' | 'employee' | 'client';
  userName: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({ userRole, userName, children }: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

