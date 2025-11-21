'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/contexts/CartContext';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductDetailsModal } from '@/components/ui/ProductDetailsModal';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

interface ImageVariant {
  url: string;
  color?: string;
  colorName?: string;
}

interface Product {
  _id: string;
  sku: string;
  name: { en: string; es: string };
  description?: { en?: string; es?: string };
  category: string;
  vehicleTypes?: string[];
  subFilters?: Record<string, string>;
  images: string[];
  imageVariants?: ImageVariant[];
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
  const [selectedSubFilters, setSelectedSubFilters] = useState<Record<string, string[]>>({});  // Changed to string[] for multiple selections
  const [expandedSubFilters, setExpandedSubFilters] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug: Log received data on mount
  useEffect(() => {
    console.log('📦 ProductsPageClient Data:', {
      totalProducts: products.length,
      totalVehicleTypes: vehicleTypes.length,
      totalCategories: productCategories.length,
      totalSubFilters: subFilters.length,
      subFiltersData: subFilters.map(sf => ({
        name: sf.name,
        slug: sf.slug,
        categorySlug: sf.categorySlug,
        optionsCount: sf.options.length,
        options: sf.options
      })),
      categories: productCategories.map(c => ({ name: c.name, slug: c.slug }))
    });
  }, [products, vehicleTypes, productCategories, subFilters]);

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

      // Filter by sub-filters - product must match ANY of the selected options within each sub-filter
      for (const subFilterSlug of Object.keys(selectedSubFilters)) {
        const selectedOptions = selectedSubFilters[subFilterSlug];

        if (!selectedOptions || selectedOptions.length === 0) continue;

        // Product must match at least one of the selected options for this sub-filter
        const productValue = product.subFilters?.[subFilterSlug];

        if (!productValue || !selectedOptions.includes(productValue)) {
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
  }, [products, selectedVehicleType, selectedCategory, selectedSubFilters, subFilters]);

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

    // Show toast notification
    toast.success(`${product.name[currentLang]} added to cart!`, {
      duration: 2000,
    });
  };

  const activeFiltersCount = [
    selectedVehicleType,
    selectedCategory,
    ...Object.values(selectedSubFilters).flat()  // Flatten arrays of selected options
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Showroom-style spotlights */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top-left spotlight */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />

        {/* Top-right spotlight */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/4 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

        {/* Bottom-left spotlight */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[90px] -translate-x-1/3 translate-y-1/3" />

        {/* Bottom-right spotlight */}
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-white/3 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Sidebar Filter with glassmorphism */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card/95 backdrop-blur-xl border-r border-border/50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
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
          {availableSubFilters.length > 0 && (
            <div className="mb-4">
              <button
                className="w-full text-left mb-3"
                onClick={() => {
                  const newExpanded = new Set(expandedSubFilters);
                  if (newExpanded.has('sub-filters')) {
                    newExpanded.delete('sub-filters');
                  } else {
                    newExpanded.add('sub-filters');
                  }
                  setExpandedSubFilters(newExpanded);
                }}
              >
                <div className="flex items-center justify-between text-white hover:text-yellow-500 transition-colors">
                  <span className="font-medium">Sub-Filters</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedSubFilters.has('sub-filters') ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedSubFilters.has('sub-filters') && (
                <div className="space-y-3 pl-2">
                  {availableSubFilters.map((subFilter) => {
                    const isSubFilterExpanded = expandedSubFilters.has(subFilter.slug);
                    const hasOptions = subFilter.options && subFilter.options.length > 0;
                    const selectedCount = selectedSubFilters[subFilter.slug]?.length || 0;

                    return (
                      <div key={subFilter.slug} className="space-y-2">
                        {/* Sub-filter name with expand button */}
                        <div className="flex items-center gap-1">
                          {/* Expand arrow if has options */}
                          {hasOptions && (
                            <button
                              onClick={() => {
                                const newExpanded = new Set(expandedSubFilters);
                                if (isSubFilterExpanded) {
                                  newExpanded.delete(subFilter.slug);
                                } else {
                                  newExpanded.add(subFilter.slug);
                                }
                                setExpandedSubFilters(newExpanded);
                              }}
                              className="p-1 hover:bg-zinc-700 rounded transition-colors"
                            >
                              <svg
                                className={`w-4 h-4 text-gray-400 hover:text-white transition-all ${isSubFilterExpanded ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}

                          {/* Spacer if no options */}
                          {!hasOptions && <div className="w-6" />}

                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm text-gray-300">{subFilter.name}</span>
                            {selectedCount > 0 && (
                              <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">
                                {selectedCount}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Options (nested under sub-filter) - Multiple selection enabled */}
                        {hasOptions && isSubFilterExpanded && (
                          <div className="pl-6 space-y-2">
                            {subFilter.options.map((option) => {
                              const currentSelections = selectedSubFilters[subFilter.slug] || [];
                              const isOptionSelected = currentSelections.includes(option);

                              return (
                                <label
                                  key={`${subFilter.slug}-${option}`}
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
                                      const currentSelections = newFilters[subFilter.slug] || [];

                                      if (isOptionSelected) {
                                        // Remove this option from selections
                                        newFilters[subFilter.slug] = currentSelections.filter(o => o !== option);
                                        // If no options left, remove the sub-filter entirely
                                        if (newFilters[subFilter.slug].length === 0) {
                                          delete newFilters[subFilter.slug];
                                        }
                                      } else {
                                        // Add this option to selections
                                        newFilters[subFilter.slug] = [...currentSelections, option];
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
              )}
            </div>
          )}

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
      <div className="flex-1 relative">
        {/* Top Bar with Filter Button */}
        <div className="sticky top-0 z-30 bg-background border-b border-border/30 shadow-lg">
          <div className="px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Filter Button - Visible on all screen sizes */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-primary/10 transition-colors relative"
                aria-label="Toggle filters"
              >
                <Filter className="h-6 w-6" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Our Products</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid with better spacing */}
        <div className="px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-12 max-w-md mx-auto">
              <svg className="w-20 h-20 text-muted-foreground mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-2xl font-bold text-foreground mb-3">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to see more products</p>
              <Button
                onClick={clearFilters}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/30"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {filteredProducts.map((product) => {
              // Prepare badges from vehicle types and sub-filters
              const badges: string[] = [];

              // Add vehicle types as badges
              if (product.vehicleTypes && product.vehicleTypes.length > 0) {
                product.vehicleTypes.forEach((vtSlug) => {
                  const vt = vehicleTypes.find(v => v.slug === vtSlug);
                  if (vt) badges.push(vt.name);
                });
              }

              // Add sub-filters as badges
              if (product.subFilters && Object.keys(product.subFilters).length > 0) {
                Object.entries(product.subFilters).forEach(([slug, value]) => {
                  const subFilter = subFilters.find(sf => sf.slug === slug);
                  if (subFilter && value) {
                    badges.push(`${subFilter.name}: ${value}`);
                  }
                });
              }

              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.name[currentLang]}
                  category={productCategories.find(c => c.slug === product.category)?.name || product.category}
                  images={product.images}
                  imageVariants={product.imageVariants}
                  badges={badges}
                  onAddToCart={() => handleAddToCart(product)}
                  onViewDetails={() => {
                    setSelectedProduct(product);
                    setIsModalOpen(true);
                  }}
                  currentLang={currentLang}
                />
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          product={{
            id: selectedProduct._id,
            title: selectedProduct.name[currentLang],
            category: productCategories.find(c => c.slug === selectedProduct.category)?.name || selectedProduct.category,
            description: selectedProduct.description?.[currentLang],
            images: selectedProduct.images,
            imageVariants: selectedProduct.imageVariants,
            badges: [],
          }}
          onAddToCart={() => handleAddToCart(selectedProduct)}
          currentLang={currentLang}
        />
      )}
    </div>
  );
}