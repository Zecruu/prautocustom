'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
}

interface SubFilter {
  _id?: string;
  name: string;
  slug: string;
  categorySlug: string;
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
  const [selectedSubFilters, setSelectedSubFilters] = useState<Record<string, string>>({});
  const [expandedSubFilters, setExpandedSubFilters] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  // Get available sub-filters for selected category
  const availableSubFilters = useMemo(() => {
    if (!selectedCategory) return [];
    
    // Filter sub-filters by category
    const categorySubFilters = subFilters.filter(sf => sf.categorySlug === selectedCategory);
    
    // Debug logging
    console.log('🔍 Sub-Filter Debug:', {
      selectedCategory,
      totalSubFilters: subFilters.length,
      categorySubFilters: categorySubFilters.length,
      subFiltersForCategory: categorySubFilters.map(sf => ({ name: sf.name, slug: sf.slug })),
      allSubFilters: subFilters.map(sf => ({ name: sf.name, slug: sf.slug, category: sf.categorySlug }))
    });
    
    return categorySubFilters;
  }, [selectedCategory, subFilters]);

  // Clear sub-filter selections and expanded state when category changes
  useEffect(() => {
    setSelectedSubFilters({});
    setExpandedSubFilters(new Set());
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Filter by vehicle type
      if (selectedVehicleType && (!product.vehicleTypes || !product.vehicleTypes.includes(selectedVehicleType))) {
        return false;
      }

      // Filter by category
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      // Filter by sub-filters - product must have ALL selected sub-filters with matching option values
      for (const subFilterSlug of Object.keys(selectedSubFilters)) {
        const selectedOption = selectedSubFilters[subFilterSlug];
        // Check if product has this sub-filter with the selected option value
        if (!product.subFilters || product.subFilters[subFilterSlug] !== selectedOption) {
          console.log('🚫 Product filtered out:', {
            productSku: product.sku,
            productName: product.name.en,
            productSubFilters: product.subFilters,
            requiredSubFilterSlug: subFilterSlug,
            requiredOption: selectedOption,
            productHasSubFilter: !!product.subFilters?.[subFilterSlug],
            productOptionValue: product.subFilters?.[subFilterSlug],
            matches: product.subFilters?.[subFilterSlug] === selectedOption
          });
          return false;
        }
      }

      return true;
    });

    // Debug logging
    if (Object.keys(selectedSubFilters).length > 0) {
      console.log('📊 Sub-Filter Results:', {
        selectedSubFilters,
        totalProducts: products.length,
        filteredCount: filtered.length,
        productsWithSubFilters: products.filter(p => p.subFilters && Object.keys(p.subFilters).length > 0).map(p => ({
          sku: p.sku,
          name: p.name.en,
          subFilters: p.subFilters
        }))
      });
    }

    return filtered;
  }, [products, selectedVehicleType, selectedCategory, selectedSubFilters]);

  const clearFilters = () => {
    setSelectedVehicleType(null);
    setSelectedCategory(null);
    setSelectedSubFilters({});
    setExpandedSubFilters(new Set());
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
    <div className="min-h-screen bg-black flex">
      {/* Sidebar Filter */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto p-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-white font-bold text-lg">Filters</h2>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Vehicle Type Filter */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedVehicleType(null)}
              className="w-full text-left mb-2"
            >
              <div className="flex items-center justify-between text-white hover:text-yellow-500 transition-colors">
                <span className="font-medium">Vehicle Type</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div className="space-y-2 pl-2">
              <label className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                <input
                  type="radio"
                  name="vehicleType"
                  checked={selectedVehicleType === null}
                  onChange={() => setSelectedVehicleType(null)}
                  className="w-4 h-4 text-yellow-500 bg-zinc-800 border-zinc-700 focus:ring-yellow-500"
                />
                <span className="text-sm">All Vehicles</span>
              </label>
              {vehicleTypes.map((vt) => (
                <label key={vt._id} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
                  <input
                    type="radio"
                    name="vehicleType"
                    checked={selectedVehicleType === vt.slug}
                    onChange={() => setSelectedVehicleType(vt.slug)}
                    className="w-4 h-4 text-yellow-500 bg-zinc-800 border-zinc-700 focus:ring-yellow-500"
                  />
                  <span className="text-sm">{vt.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <button className="w-full text-left mb-2">
              <div className="flex items-center justify-between text-white hover:text-yellow-500 transition-colors">
                <span className="font-medium">Category</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div className="space-y-2 pl-2">
              {productCategories.map((cat) => (
                <label key={cat._id} className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer group">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-yellow-500 border-yellow-500'
                      : 'border-zinc-600 group-hover:border-zinc-500'
                  }`}>
                    {selectedCategory === cat.slug && (
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" onClick={() => setSelectedCategory(cat.slug)}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sub-Filters (shown when category is selected and has sub-filters) */}
          {availableSubFilters.length > 0 && availableSubFilters.map((subFilter) => {
            const isExpanded = expandedSubFilters.has(subFilter.slug);
            const isSelected = selectedSubFilters[subFilter.slug] !== undefined;

            return (
              <div key={subFilter._id || subFilter.slug} className="mb-4">
                <button
                  className="w-full text-left mb-2"
                  onClick={() => {
                    const newExpanded = new Set(expandedSubFilters);
                    if (isExpanded) {
                      newExpanded.delete(subFilter.slug);
                    } else {
                      newExpanded.add(subFilter.slug);
                    }
                    setExpandedSubFilters(newExpanded);
                  }}
                >
                  <div className="flex items-center justify-between text-white hover:text-yellow-500 transition-colors">
                    <span className={`font-medium ${isSelected ? 'text-yellow-500' : ''}`}>
                      {subFilter.name}
                      {isSelected && ` (${selectedSubFilters[subFilter.slug]})`}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="space-y-2 pl-2">
                    {subFilter.options.map((option) => {
                      const isOptionSelected = selectedSubFilters[subFilter.slug] === option;

                      return (
                        <label
                          key={option}
                          className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer group"
                        >
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                              isOptionSelected
                                ? 'bg-yellow-500 border-yellow-500'
                                : 'border-zinc-600 group-hover:border-zinc-500'
                            }`}
                            onClick={() => {
                              const newFilters = { ...selectedSubFilters };
                              if (isOptionSelected) {
                                delete newFilters[subFilter.slug];
                              } else {
                                newFilters[subFilter.slug] = option;
                              }
                              setSelectedSubFilters(newFilters);
                            }}
                          >
                            {isOptionSelected && (
                              <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar with Hamburger */}
        <div className="sticky top-0 z-30 bg-black border-b border-zinc-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Our Products</h1>
                <p className="text-sm text-gray-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  );
}