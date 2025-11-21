'use client';

import React, { useState } from 'react';
import { IVehicleType, IProductCategory, ISubFilter } from '@/models/Settings';

interface SettingsClientProps {
  initialVehicleTypes: IVehicleType[];
  initialProductCategories: IProductCategory[];
  initialSubFilters: ISubFilter[];
}

export function SettingsClient({ initialVehicleTypes, initialProductCategories, initialSubFilters }: SettingsClientProps) {
  const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>(initialVehicleTypes);
  const [productCategories, setProductCategories] = useState<IProductCategory[]>(initialProductCategories);
  const [subFilters, setSubFilters] = useState<ISubFilter[]>(initialSubFilters);
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

  // Sub-Filters Management
  const addSubFilter = () => {
    setSubFilters([
      ...subFilters,
      {
        name: '',
        slug: '',
        categorySlug: '',
        options: [],
        active: true,
      },
    ]);
  };

  const updateSubFilter = (index: number, field: keyof ISubFilter, value: string | boolean | string[]) => {
    const updated = [...subFilters];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      updated[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    setSubFilters(updated);
  };

  const addSubFilterOption = (subFilterIndex: number) => {
    const updated = [...subFilters];
    updated[subFilterIndex].options = [...updated[subFilterIndex].options, ''];
    setSubFilters(updated);
  };

  const updateSubFilterOption = (subFilterIndex: number, optionIndex: number, value: string) => {
    const updated = [...subFilters];
    updated[subFilterIndex].options[optionIndex] = value;
    setSubFilters(updated);
  };

  const removeSubFilterOption = (subFilterIndex: number, optionIndex: number) => {
    const updated = [...subFilters];
    updated[subFilterIndex].options = updated[subFilterIndex].options.filter((_, i) => i !== optionIndex);
    setSubFilters(updated);
  };

  const removeSubFilter = (index: number) => {
    setSubFilters(subFilters.filter((_, i) => i !== index));
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
          subFilters,
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
    } catch {
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
          <div className="flex gap-3">
            <button
              onClick={addVehicleType}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
            >
              + Add Vehicle Type
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
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
            <p className="text-center text-gray-500 py-8">No vehicle types added yet. Click &quot;Add Vehicle Type&quot; to get started.</p>
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
          <div className="flex gap-3">
            <button
              onClick={addProductCategory}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
            >
              + Add Category
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
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
            <p className="text-center text-gray-500 py-8">No categories added yet. Click &quot;Add Category&quot; to get started.</p>
          )}
        </div>
      </div>

      {/* Sub-Filters Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Sub-Filters</h2>
            <p className="text-sm text-gray-400">Create sub-filters with multiple options for advanced filtering</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addSubFilter}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
            >
              + Add Sub-Filter
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Example Box */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="text-blue-300 font-medium mb-2">How to use Sub-Filters:</p>
              <div className="text-blue-200/80 space-y-1">
                <p><strong className="text-blue-300">Example for Wheels:</strong></p>
                <p className="pl-4">• Sub-Filter Name: <span className="text-white">&quot;Wheel Size&quot;</span></p>
                <p className="pl-4">• Category: <span className="text-white">&quot;Wheels&quot;</span></p>
                <p className="pl-4">• Options: <span className="text-white">&quot;BMW 17&quot;&quot;, &quot;BMW 18&quot;&quot;, &quot;BMW 19&quot;&quot;, &quot;BMW 20&quot;&quot;, &quot;BMW 21&quot;&quot;, &quot;BMW 22&quot;&quot;</span></p>
                <p className="mt-2 text-xs text-blue-300/70">This creates ONE dropdown with 6 selectable options on the products page.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {subFilters.map((subFilter, subFilterIndex) => (
            <div key={subFilterIndex} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 space-y-3">
              {/* Sub-filter Name, Category, and Slug */}
              <div className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={subFilter.name}
                    onChange={(e) => updateSubFilter(subFilterIndex, 'name', e.target.value)}
                    placeholder="Sub-Filter Name (e.g., Wheel Size, Bolt Pattern)"
                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-yellow-500"
                  />
                  <select
                    value={subFilter.categorySlug}
                    onChange={(e) => updateSubFilter(subFilterIndex, 'categorySlug', e.target.value)}
                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="">Select Category</option>
                    {productCategories.map((cat) => (
                      <option key={cat._id || cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={subFilter.slug}
                    placeholder="Slug (auto-generated)"
                    className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-gray-400 focus:outline-none focus:border-yellow-500"
                    readOnly
                  />
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subFilter.active}
                    onChange={(e) => updateSubFilter(subFilterIndex, 'active', e.target.checked)}
                    className="w-4 h-4 text-yellow-500 bg-zinc-900 border-zinc-700 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-400">Active</span>
                </label>

                <button
                  onClick={() => removeSubFilter(subFilterIndex)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  title="Delete Sub-Filter"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Options for this sub-filter */}
              <div className="pl-4 border-l-2 border-yellow-500/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400 font-medium">Options:</p>
                  <button
                    onClick={() => addSubFilterOption(subFilterIndex)}
                    className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
                <div className="space-y-2">
                  {subFilter.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateSubFilterOption(subFilterIndex, optionIndex, e.target.value)}
                        placeholder='Option value (e.g., BMW 17", 5 hole, Black)'
                        className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                      />
                      <button
                        onClick={() => removeSubFilterOption(subFilterIndex, optionIndex)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        title="Remove Option"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {subFilter.options.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No options added yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {subFilters.length === 0 && (
            <p className="text-center text-gray-500 py-8">No sub-filters added yet. Click &quot;Add Sub-Filter&quot; to get started.</p>
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

