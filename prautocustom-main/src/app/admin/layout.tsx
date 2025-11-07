import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If authenticated, show the admin layout with sidebar
  if (session) {
    // Check if user has admin or employee role
    if (session.user.role === 'client') {
      redirect('/'); // Redirect clients to main site
    }

    return (
      <AdminLayoutClient userRole={session.user.role} userName={session.user.name}>
        {children}
      </AdminLayoutClient>
    );
  }

  // If not authenticated, render children without sidebar (for signin page)
  return <>{children}</>;
}

