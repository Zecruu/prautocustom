import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Always redirect to signin page
  // The signin page will handle redirecting to dashboard if already authenticated
  redirect('/admin/signin');
}

