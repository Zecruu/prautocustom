'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

interface SubFilter {
  _id: string;
  name: string;
  slug: string;
  categorySlug: string;
  options: string[];
  active: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [subFilters, setSubFilters] = useState<SubFilter[]>([]);

  const [formData, setFormData] = useState({
    sku: '',
    nameEn: '',
    nameEs: '',
    descriptionEn: '',
    descriptionEs: '',
    category: '',
    vehicleTypes: [] as string[],
    subFilters: {} as Record<string, string>,
    stock: '',
    status: 'active',
    images: [] as string[],
  });

  const [enableSubFilters, setEnableSubFilters] = useState(false);
  const [selectedSubFilterSlugs, setSelectedSubFilterSlugs] = useState<string[]>([]);

  // Fetch product and settings on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product
        const productResponse = await fetch(`/api/admin/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }
        const product = await productResponse.json();

        // Fetch settings
        const settingsResponse = await fetch('/api/admin/settings');
        if (settingsResponse.ok) {
          const data = await settingsResponse.json();
          setVehicleTypes(data.vehicleTypes.filter((vt: VehicleType) => vt.active));
          setProductCategories(data.productCategories.filter((pc: ProductCategory) => pc.active));
          setSubFilters(data.subFilters.filter((sf: SubFilter) => sf.active));
        }

        // Populate form
        setFormData({
          sku: product.sku || '',
          nameEn: product.name?.en || '',
          nameEs: product.name?.es || '',
          descriptionEn: product.description?.en || '',
          descriptionEs: product.description?.es || '',
          category: product.category || '',
          vehicleTypes: product.vehicleTypes || [],
          subFilters: product.subFilters || {},
          stock: String(product.stock || 0),
          status: product.status || 'active',
          images: product.images || [],
        });

        // Set sub-filters state
        if (product.subFilters && Object.keys(product.subFilters).length > 0) {
          setEnableSubFilters(true);
          setSelectedSubFilterSlugs(Object.keys(product.subFilters));
        }

        setFetching(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
        setFetching(false);
      }
    };
    fetchData();
  }, [productId]);

  // Reset sub-filters when category changes
  useEffect(() => {
    if (!fetching) {
      setEnableSubFilters(false);
      setSelectedSubFilterSlugs([]);
      setFormData(prev => ({ ...prev, subFilters: {} }));
    }
  }, [formData.category, fetching]);

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

  const addSubFilterSlot = () => {
    setSelectedSubFilterSlugs([...selectedSubFilterSlugs, '']);
  };

  const updateSubFilterSelection = (index: number, subFilterSlug: string) => {
    const updated = [...selectedSubFilterSlugs];
    const oldSlug = updated[index];
    
    if (oldSlug && oldSlug !== subFilterSlug) {
      const newSubFilters = { ...formData.subFilters };
      delete newSubFilters[oldSlug];
      setFormData({ ...formData, subFilters: newSubFilters });
    }
    
    updated[index] = subFilterSlug;
    setSelectedSubFilterSlugs(updated);
  };

  const removeSubFilterSlot = (index: number) => {
    const slugToRemove = selectedSubFilterSlugs[index];
    
    setSelectedSubFilterSlugs(selectedSubFilterSlugs.filter((_, i) => i !== index));
    
    if (slugToRemove) {
      const newSubFilters = { ...formData.subFilters };
      delete newSubFilters[slugToRemove];
      setFormData({ ...formData, subFilters: newSubFilters });
    }
  };

  const handleSubFilterOptionChange = (subFilterSlug: string, optionValue: string) => {
    setFormData({
      ...formData,
      subFilters: {
        ...formData.subFilters,
        [subFilterSlug]: optionValue,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
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
          subFilters: formData.subFilters,
          stock: parseInt(formData.stock) || 0,
          status: formData.status,
          images: formData.images.filter(img => img !== ''),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Product</h1>
        <p className="text-gray-400">Update product information</p>
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

          {/* Add Sub-Filters Option */}
          {formData.category && subFilters.filter(sf => sf.categorySlug === formData.category).length > 0 && (
            <div className="border-t border-zinc-700 pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={enableSubFilters}
                  onChange={(e) => {
                    setEnableSubFilters(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedSubFilterSlugs([]);
                      setFormData({ ...formData, subFilters: {} });
                    }
                  }}
                  className="w-5 h-5 text-yellow-500 bg-zinc-800 border-zinc-700 rounded focus:ring-yellow-500"
                />
                <div>
                  <span className="text-base font-medium text-white group-hover:text-yellow-500 transition-colors">
                    Add Sub-Filters to this product?
                  </span>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Enable to add specific sub-filters like size, color, or other attributes
                  </p>
                </div>
              </label>

              {/* Sub-Filters Selection */}
              {enableSubFilters && (
                <div className="mt-4 space-y-4 pl-8 border-l-2 border-yellow-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white">Product Sub-Filters</h4>
                    <button
                      type="button"
                      onClick={addSubFilterSlot}
                      className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium rounded-lg transition-colors"
                    >
                      + Add Sub-Filter
                    </button>
                  </div>

                  {selectedSubFilterSlugs.map((selectedSlug, index) => {
                    const selectedSubFilter = subFilters.find(sf => sf.slug === selectedSlug);
                    
                    return (
                      <div key={index} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-3">
                            {/* Sub-Filter Selection Dropdown */}
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">
                                Select Sub-Filter Type
                              </label>
                              <select
                                value={selectedSlug}
                                onChange={(e) => updateSubFilterSelection(index, e.target.value)}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                              >
                                <option value="">Choose a sub-filter...</option>
                                {subFilters.filter(sf => sf.categorySlug === formData.category).map((sf) => (
                                  <option 
                                    key={sf._id || sf.slug} 
                                    value={sf.slug}
                                    disabled={selectedSubFilterSlugs.includes(sf.slug) && sf.slug !== selectedSlug}
                                  >
                                    {sf.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Options for Selected Sub-Filter */}
                            {selectedSubFilter && (
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-2">
                                  Select {selectedSubFilter.name} Option
                                </label>
                                <select
                                  value={formData.subFilters[selectedSlug] || ''}
                                  onChange={(e) => handleSubFilterOptionChange(selectedSlug, e.target.value)}
                                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                                >
                                  <option value="">Select {selectedSubFilter.name}</option>
                                  {selectedSubFilter.options.map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeSubFilterSlot(index)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors mt-6"
                            title="Remove Sub-Filter"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {selectedSubFilterSlugs.length === 0 && (
                    <p className="text-sm text-gray-500 italic py-4 text-center">
                      No sub-filters added yet. Click &quot;Add Sub-Filter&quot; to get started.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

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
            {loading ? 'Updating...' : 'Update Product'}
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

