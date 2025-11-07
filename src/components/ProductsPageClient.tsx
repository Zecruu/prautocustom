'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';

interface Product {
  _id: string;
  sku: string;
  name: { en: string; es: string };
  category: string;
  vehicleTypes?: string[];
  subFilters?: Record<string, string>;
  images: string[];
  stock: number;
  status: string;
}

interface VehicleType {
  _id?: string;
  name: string;
  slug: string;
  active: boolean;
}

interface ProductCategory {
  _id?: string;
  name: string;
  slug: string;
  active: boolean;
  subFilterIds?: string[];
}

interface SubFilter {
  _id?: string;
  name: string;
  slug: string;
  options: string[];
  active: boolean;
}

interface ProductsPageClientProps {
  products: Product[];
  vehicleTypes: VehicleType[];
  productCategories: ProductCategory[];
  subFilters: SubFilter[];
}

export function ProductsPageClient({ products, vehicleTypes, productCategories, subFilters }: ProductsPageClientProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'es';
  const { addToCart } = useCart();
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubFilters, setSelectedSubFilters] = useState<Record<string, string>>({}); // Map of subFilterSlug -> selectedOption
  const [showFilters, setShowFilters] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  // Get available sub-filters for selected category
  const availableSubFilters = useMemo(() => {
    if (!selectedCategory) return [];
    const category = productCategories.find(c => c.slug === selectedCategory);
    if (!category || !category.subFilterIds) return [];
    return subFilters.filter(sf => category.subFilterIds?.includes(sf._id || sf.slug));
  }, [selectedCategory, productCategories, subFilters]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by vehicle type
      if (selectedVehicleType && (!product.vehicleTypes || !product.vehicleTypes.includes(selectedVehicleType))) {
        return false;
      }

      // Filter by category
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Filter by sub-filters
      for (const [subFilterSlug, selectedOption] of Object.entries(selectedSubFilters)) {
        if (selectedOption && selectedOption !== '') {
          const productSubFilterValue = product.subFilters?.[subFilterSlug];
          if (productSubFilterValue !== selectedOption) {
            return false;
          }
        }
      }

      return true;
    });
  }, [products, selectedVehicleType, selectedCategory, selectedSubFilters]);

  const clearFilters = () => {
    setSelectedVehicleType(null);
    setSelectedCategory(null);
    setSelectedSubFilters({});
  };

  const handleSubFilterChange = (subFilterSlug: string, value: string) => {
    setSelectedSubFilters(prev => ({
      ...prev,
      [subFilterSlug]: value,
    }));
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product._id,
      sku: product.sku,
      name: product.name,
      image: product.images[0] || '',
      category: product.category,
    });

    // Show feedback
    setAddedToCart(product._id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const activeFiltersCount = [
    selectedVehicleType, 
    selectedCategory,
    ...Object.values(selectedSubFilters).filter(v => v && v !== '')
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Filters */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Our Products</h1>
              <p className="text-gray-400 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
              </p>
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden relative px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Section */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
            {/* Vehicle Types Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Vehicle Type</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedVehicleType(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedVehicleType === null
                      ? 'bg-yellow-500 text-black'
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  All Vehicles
                </button>
                {vehicleTypes.map((vt) => (
                  <button
                    key={vt._id}
                    onClick={() => setSelectedVehicleType(vt.slug)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedVehicleType === vt.slug
                        ? 'bg-yellow-500 text-black'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    {vt.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Categories Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Category</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-yellow-500 text-black'
                      : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  All Categories
                </button>
                {productCategories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-yellow-500 text-black'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Filters (shown when category is selected and has sub-filters) */}
            {availableSubFilters.length > 0 && (
              <div className="border-t border-zinc-700 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Sub-Filters</h3>
                </div>
                <div className="space-y-3">
                  {availableSubFilters.map((subFilter) => (
                    <div key={subFilter._id || subFilter.slug}>
                      <label className="block text-xs font-medium text-gray-400 mb-2">
                        {subFilter.name}
                      </label>
                      <select
                        value={selectedSubFilters[subFilter.slug] || ''}
                        onChange={(e) => handleSubFilterChange(subFilter.slug, e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500"
                      >
                        <option value="">All {subFilter.name}</option>
                        {subFilter.options.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-yellow-500 hover:text-yellow-400 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your filters to see more products</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-zinc-800">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name[currentLang]}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  {product.stock === 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 group-hover:text-yellow-500 transition-colors">
                    {product.name[currentLang]}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {productCategories.find(c => c.slug === product.category)?.name || product.category}
                    </span>
                  </div>

                  {/* Vehicle Types Tags */}
                  {product.vehicleTypes && product.vehicleTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.vehicleTypes.map((vtSlug) => {
                        const vt = vehicleTypes.find(v => v.slug === vtSlug);
                        return vt ? (
                          <span
                            key={vtSlug}
                            className="text-xs bg-zinc-800 text-yellow-500 px-2 py-1 rounded-full border border-zinc-700"
                          >
                            {vt.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0 || addedToCart === product._id}
                    className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      addedToCart === product._id
                        ? 'bg-green-500 text-white'
                        : product.stock === 0
                        ? 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    }`}
                  >
                    {addedToCart === product._id ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

