import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect('/admin/dashboard');
  }

  // If not authenticated, redirect to signin
  redirect('/admin/signin');
}

