'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  images: string[];
  badges?: string[];
  onAddToCart: (id: string) => void;
  currentLang: 'en' | 'es';
}

export function ProductCard({ 
  id, 
  title, 
  category, 
  images = [], 
  badges = [], 
  onAddToCart,
  currentLang
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoading(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageLoading(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-xl hover:scale-[1.03] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/70 hover:bg-card/95">
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Product Image with Carousel */}
      <div className="relative">
        <AspectRatio ratio={1}>
          {images && images.length > 0 ? (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={title}
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Enhanced gradient overlay with glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

              {/* Image navigation arrows with glassmorphism */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-primary/80 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 backdrop-blur-md hover:bg-primary/80 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Enhanced image indicators with glassmorphism */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentImageIndex
                            ? 'w-8 bg-primary shadow-lg shadow-primary/50'
                            : 'w-1.5 bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </AspectRatio>
      </div>

      <CardContent className="relative p-5 space-y-3">
        <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="uppercase text-xs bg-primary/20 text-primary font-bold border border-primary/30 shadow-sm">
            {category}
          </Badge>
          {badges.map((badge, i) => (
            <Badge key={i} variant="outline" className="text-xs border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
              {badge}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          onClick={() => onAddToCart(id)}
          className="w-full bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground font-bold transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] group/btn"
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          {currentLang === 'es' ? 'Agregar al Carrito' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}

