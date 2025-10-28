'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductActionsProps {
  productId: string;
  status: string;
}

export default function ProductActions({ productId, status }: ProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = status === 'active' ? 'hidden' : 'active';
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product status');
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update product status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="text-blue-500 hover:text-blue-400 font-medium"
      >
        Edit
      </Link>
      <button
        onClick={handleToggleStatus}
        disabled={loading}
        className="text-yellow-500 hover:text-yellow-400 font-medium disabled:opacity-50"
      >
        {status === 'active' ? 'Hide' : 'Unhide'}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-500 hover:text-red-400 font-medium disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}

