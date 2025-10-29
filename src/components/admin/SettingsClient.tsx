'use client';

import React, { useState } from 'react';
import { IVehicleType, IProductCategory } from '@/models/Settings';

interface SettingsClientProps {
  initialVehicleTypes: IVehicleType[];
  initialProductCategories: IProductCategory[];
}

export function SettingsClient({ initialVehicleTypes, initialProductCategories }: SettingsClientProps) {
  const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>(initialVehicleTypes);
  const [productCategories, setProductCategories] = useState<IProductCategory[]>(initialProductCategories);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Vehicle Types Management
  const addVehicleType = () => {
    setVehicleTypes([
      ...vehicleTypes,
      {
        name: '',
        slug: '',
        active: true,
      },
    ]);
  };

  const updateVehicleType = (index: number, field: keyof IVehicleType, value: string | boolean) => {
    const updated = [...vehicleTypes];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      updated[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    setVehicleTypes(updated);
  };

  const removeVehicleType = (index: number) => {
    setVehicleTypes(vehicleTypes.filter((_, i) => i !== index));
  };

  // Product Categories Management
  const addProductCategory = () => {
    setProductCategories([
      ...productCategories,
      {
        name: '',
        slug: '',
        active: true,
      },
    ]);
  };

  const updateProductCategory = (index: number, field: keyof IProductCategory, value: string | boolean) => {
    const updated = [...productCategories];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      updated[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    setProductCategories(updated);
  };

  const removeProductCategory = (index: number) => {
    setProductCategories(productCategories.filter((_, i) => i !== index));
  };

  // Save Settings
  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleTypes,
          productCategories,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      
      // Reload to get updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500 text-green-500'
              : 'bg-red-500/10 border-red-500 text-red-500'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Vehicle Types Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Vehicle Types</h2>
            <p className="text-sm text-gray-400">Manage vehicle types for product filtering (e.g., Jeep, Truck, SUV)</p>
          </div>
          <button
            onClick={addVehicleType}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
          >
            + Add Vehicle Type
          </button>
        </div>

        <div className="space-y-3">
          {vehicleTypes.map((vehicleType, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={vehicleType.name}
                  onChange={(e) => updateVehicleType(index, 'name', e.target.value)}
                  placeholder="Vehicle Type Name (e.g., Jeep)"
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-yellow-500"
                />
                <input
                  type="text"
                  value={vehicleType.slug}
                  onChange={(e) => updateVehicleType(index, 'slug', e.target.value)}
                  placeholder="Slug (auto-generated)"
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-gray-400 focus:outline-none focus:border-yellow-500"
                  readOnly
                />
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vehicleType.active}
                  onChange={(e) => updateVehicleType(index, 'active', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 bg-zinc-900 border-zinc-700 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-400">Active</span>
              </label>

              <button
                onClick={() => removeVehicleType(index)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {vehicleTypes.length === 0 && (
            <p className="text-center text-gray-500 py-8">No vehicle types added yet. Click "Add Vehicle Type" to get started.</p>
          )}
        </div>
      </div>

      {/* Product Categories Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Product Categories</h2>
            <p className="text-sm text-gray-400">Manage product categories for filtering (e.g., Rims, Lights, Bumpers)</p>
          </div>
          <button
            onClick={addProductCategory}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
          >
            + Add Category
          </button>
        </div>

        <div className="space-y-3">
          {productCategories.map((category, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => updateProductCategory(index, 'name', e.target.value)}
                  placeholder="Category Name (e.g., Rims)"
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-yellow-500"
                />
                <input
                  type="text"
                  value={category.slug}
                  onChange={(e) => updateProductCategory(index, 'slug', e.target.value)}
                  placeholder="Slug (auto-generated)"
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-gray-400 focus:outline-none focus:border-yellow-500"
                  readOnly
                />
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={category.active}
                  onChange={(e) => updateProductCategory(index, 'active', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 bg-zinc-900 border-zinc-700 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-400">Active</span>
              </label>

              <button
                onClick={() => removeProductCategory(index)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {productCategories.length === 0 && (
            <p className="text-center text-gray-500 py-8">No categories added yet. Click "Add Category" to get started.</p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

