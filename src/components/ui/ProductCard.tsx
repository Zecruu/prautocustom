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
    <Card className="group overflow-hidden border-border bg-card hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50">
      {/* Product Image with Carousel */}
      <div className="relative">
        <AspectRatio ratio={1}>
          {images && images.length > 0 ? (
            <>
              <Image 
                src={images[currentImageIndex]} 
                alt={title}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              
              {/* Image navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentImageIndex 
                            ? 'w-6 bg-primary' 
                            : 'w-1.5 bg-white/50'
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
      
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="uppercase text-xs bg-muted text-primary font-semibold">
            {category}
          </Badge>
          {badges.map((badge, i) => (
            <Badge key={i} variant="outline" className="text-xs border-primary/30 text-muted-foreground">
              {badge}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(id)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all hover:shadow-lg hover:shadow-primary/20"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {currentLang === 'es' ? 'Agregar al Carrito' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}

