'use client';

import { Button } from '@/components/ui/button';
import { MapPin, MessageCircle } from 'lucide-react';

export function FloatingActions() {
  const handleLocationClick = () => {
    // Open Google Maps location
    window.open('https://maps.google.com/?q=PR+Auto+Custom', '_blank');
  };

  const handleWhatsAppClick = () => {
    // Open WhatsApp chat
    window.open('https://wa.me/17877055536', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      {/* Location Button with enhanced glassmorphism */}
      <Button
        size="icon"
        onClick={handleLocationClick}
        className="h-16 w-16 rounded-full bg-blue-600/90 hover:bg-blue-600 backdrop-blur-md shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 hover:scale-110 border border-blue-400/20 group"
        aria-label="View location on map"
      >
        <MapPin className="h-7 w-7 group-hover:scale-110 transition-transform" />
      </Button>

      {/* WhatsApp Button with enhanced glassmorphism */}
      <Button
        size="icon"
        onClick={handleWhatsAppClick}
        className="h-16 w-16 rounded-full bg-green-600/90 hover:bg-green-600 backdrop-blur-md shadow-2xl hover:shadow-green-600/50 transition-all duration-300 hover:scale-110 border border-green-400/20 group"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
      </Button>
    </div>
  );
}

