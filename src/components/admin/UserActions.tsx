'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserActionsProps {
  userId: string;
  userEmail: string;
  currentUserEmail: string;
}

export default function UserActions({ userId, userEmail, currentUserEmail }: UserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isCurrentUser = userEmail === currentUserEmail;

  const handleDelete = async () => {
    if (isCurrentUser) {
      alert('You cannot delete your own account');
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete this user? This action cannot be undone and will remove all their data.`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button className="text-blue-500 hover:text-blue-400 font-medium" disabled={loading}>
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={loading || isCurrentUser}
        className="text-red-500 hover:text-red-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete
      </button>
    </div>
  );
}

