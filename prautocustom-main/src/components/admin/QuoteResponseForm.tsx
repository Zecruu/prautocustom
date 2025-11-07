'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
}

interface QuoteResponseFormProps {
  quoteId: string;
  products: Product[];
  employeeId: string;
  employeeName: string;
}

export default function QuoteResponseForm({
  quoteId,
  products,
  employeeId,
}: QuoteResponseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize pricing state
  const [productPrices, setProductPrices] = useState<
    Record<string, { unitPrice: number; notes: string }>
  >(
    products.reduce(
      (acc, p) => ({
        ...acc,
        [p.productId]: { unitPrice: 0, notes: '' },
      }),
      {}
    )
  );

  const [taxRate, setTaxRate] = useState(8.25); // Default tax rate
  const [generalNotes, setGeneralNotes] = useState('');
  const [validityDays, setValidityDays] = useState(15);

  // Calculate totals
  const subtotal = products.reduce((sum, p) => {
    const price = productPrices[p.productId]?.unitPrice || 0;
    return sum + price * p.quantity;
  }, 0);

  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare response data
      const responseData = {
        quote: quoteId,
        respondedBy: employeeId,
        products: products.map((p) => ({
          product: p.productId,
          unitPrice: productPrices[p.productId]?.unitPrice || 0,
          quantity: p.quantity,
          notes: productPrices[p.productId]?.notes || '',
        })),
        subtotal,
        tax,
        total,
        notes: generalNotes,
        validityDays,
      };

      const response = await fetch('/api/admin/quotes/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send quote response');
      }

      // Refresh the page to show the new response
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send quote response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Product Pricing */}
      <div className="space-y-4">
        <h3 className="text-white font-medium">Product Pricing</h3>
        {products.map((product) => (
          <div
            key={product.productId}
            className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
          >
            <div className="mb-3">
              <p className="text-white font-medium">{product.name}</p>
              <p className="text-gray-400 text-sm">
                SKU: {product.sku} | Qty: {product.quantity}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={productPrices[product.productId]?.unitPrice || ''}
                  onChange={(e) =>
                    setProductPrices({
                      ...productPrices,
                      [product.productId]: {
                        ...productPrices[product.productId],
                        unitPrice: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Line Total</label>
                <div className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-green-500 font-medium">
                  ${((productPrices[product.productId]?.unitPrice || 0) * product.quantity).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-gray-400 text-sm mb-2">Notes (optional)</label>
              <input
                type="text"
                value={productPrices[product.productId]?.notes || ''}
                onChange={(e) =>
                  setProductPrices({
                    ...productPrices,
                    [product.productId]: {
                      ...productPrices[product.productId],
                      notes: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                placeholder="e.g., Lead time: 2 weeks"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tax Rate */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">Tax Rate (%)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={taxRate}
          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
        />
      </div>

      {/* Quote Validity */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">Quote Valid For (days)</label>
        <input
          type="number"
          min="1"
          max="90"
          value={validityDays}
          onChange={(e) => setValidityDays(parseInt(e.target.value) || 15)}
          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
        />
      </div>

      {/* General Notes */}
      <div>
        <label className="block text-gray-400 text-sm mb-2">General Notes (optional)</label>
        <textarea
          value={generalNotes}
          onChange={(e) => setGeneralNotes(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          placeholder="Additional terms, conditions, or information..."
        />
      </div>

      {/* Summary */}
      <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <h3 className="text-white font-medium mb-3">Quote Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Tax ({taxRate}%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-700">
            <span>Total:</span>
            <span className="text-green-500">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || subtotal === 0}
        className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors"
      >
        {loading ? 'Sending...' : 'Send Quote Response'}
      </button>
    </form>
  );
}

