'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ImageVariant {
  url: string;
  color?: string;
  colorName?: string;
}

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    category: string;
    description?: string;
    images: string[];
    imageVariants?: ImageVariant[];
    badges?: string[];
  };
  onAddToCart: (id: string) => void;
  currentLang: 'en' | 'es';
}

export function ProductDetailsModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  currentLang,
}: ProductDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  if (!isOpen) return null;

  const displayImages = product.imageVariants && product.imageVariants.length > 0
    ? product.imageVariants.map(v => v.url)
    : product.images;

  const currentImage = displayImages[currentImageIndex] || product.images[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleColorSelect = (index: number) => {
    setSelectedColorIndex(index);
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    onAddToCart(product.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-card border border-border/50 rounded-lg shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Left Side - Product Image */}
          <div className="md:w-1/2 bg-muted/30 p-8 flex items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-lg">
              {currentImage ? (
                <>
                  <Image
                    src={currentImage}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Image Navigation */}
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-primary/80 text-white transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-primary/80 text-white transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                        {displayImages.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'w-8 bg-primary'
                                : 'w-2 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="md:w-1/2 p-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-3xl font-bold text-foreground">{product.title}</h2>

              {/* Category & Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="uppercase text-sm bg-primary/20 text-primary font-bold border border-primary/30">
                  {product.category}
                </Badge>
                {product.badges?.map((badge, i) => (
                  <Badge key={i} variant="outline" className="text-sm">
                    {badge}
                  </Badge>
                ))}
              </div>


              {/* Color Picker */}
              {product.imageVariants && product.imageVariants.length > 0 && product.imageVariants.some(v => v.color) && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Color: <span className="text-foreground font-semibold text-base">{product.imageVariants[selectedColorIndex]?.colorName || 'Select'}</span>
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {product.imageVariants.map((variant, idx) => (
                      variant.color && (
                        <button
                          key={idx}
                          onClick={() => handleColorSelect(idx)}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                            selectedColorIndex === idx
                              ? 'border-primary shadow-lg shadow-primary/50 ring-2 ring-primary/30'
                              : 'border-border/50 hover:border-primary/50'
                          }`}
                          style={{ backgroundColor: variant.color }}
                          title={variant.colorName || variant.color}
                        />
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {currentLang === 'es' ? 'Descripción' : 'Description'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Note about Quote-based */}
              <div className="bg-muted/50 border border-border/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  {currentLang === 'es'
                    ? '💡 Este es un sistema basado en cotizaciones. Agregue productos al carrito y solicite una cotización personalizada.'
                    : '💡 This is a quote-based system. Add products to cart and request a custom quote.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-border/50 hover:border-primary/50"
                >
                  {currentLang === 'es' ? 'Volver' : 'Back'}
                </Button>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-bold"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {currentLang === 'es' ? 'Agregar al Carrito' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

