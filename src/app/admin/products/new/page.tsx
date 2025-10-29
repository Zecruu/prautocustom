'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface VehicleType {
  _id: string;
  name: string;
  slug: string;
  active: boolean;
}

interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  active: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);

  const [formData, setFormData] = useState({
    sku: '',
    nameEn: '',
    nameEs: '',
    descriptionEn: '',
    descriptionEs: '',
    category: '',
    vehicleTypes: [] as string[],
    stock: '',
    status: 'active',
    images: [] as string[],
  });

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setVehicleTypes(data.vehicleTypes.filter((vt: VehicleType) => vt.active));
          setProductCategories(data.productCategories.filter((pc: ProductCategory) => pc.active));
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleImageUpload = (url: string, index: number) => {
    const newImages = [...formData.images];
    if (url) {
      newImages[index] = url;
    } else {
      newImages.splice(index, 1);
    }
    setFormData({ ...formData, images: newImages });
  };

  const addImageSlot = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const toggleVehicleType = (slug: string) => {
    const newVehicleTypes = formData.vehicleTypes.includes(slug)
      ? formData.vehicleTypes.filter(vt => vt !== slug)
      : [...formData.vehicleTypes, slug];
    setFormData({ ...formData, vehicleTypes: newVehicleTypes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: formData.sku,
          name: {
            en: formData.nameEn,
            es: formData.nameEs,
          },
          description: {
            en: formData.descriptionEn,
            es: formData.descriptionEs,
          },
          category: formData.category,
          vehicleTypes: formData.vehicleTypes,
          stock: parseInt(formData.stock) || 0,
          status: formData.status,
          images: formData.images.filter(img => img !== ''),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Product</h1>
        <p className="text-gray-400">Add a new product to your catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                placeholder="PROD-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              >
                <option value="">Select a category</option>
                {productCategories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle Types */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Vehicle Types <span className="text-gray-500">(Select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {vehicleTypes.map((vt) => (
                <button
                  key={vt._id}
                  type="button"
                  onClick={() => toggleVehicleType(vt.slug)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    formData.vehicleTypes.includes(vt.slug)
                      ? 'bg-yellow-500 border-yellow-500 text-black'
                      : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:border-yellow-500'
                  }`}
                >
                  {vt.name}
                </button>
              ))}
            </div>
            {vehicleTypes.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No vehicle types available. Add them in Settings.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              placeholder="Product name in English"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name (Spanish) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nameEs}
              onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              placeholder="Nombre del producto en español"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (English)
            </label>
            <textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              placeholder="Product description in English"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Spanish)
            </label>
            <textarea
              value={formData.descriptionEs}
              onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              placeholder="Descripción del producto en español"
            />
          </div>
        </div>

        {/* Inventory & Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Inventory & Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Product Images</h2>
          
          {formData.images.map((image, index) => (
            <ImageUpload
              key={index}
              currentImage={image}
              onUploadComplete={(url) => handleImageUpload(url, index)}
              label={`Image ${index + 1}`}
            />
          ))}

          <button
            type="button"
            onClick={addImageSlot}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg border border-zinc-700 transition-colors"
          >
            + Add Another Image
          </button>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

