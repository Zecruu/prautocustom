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
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <Button 
        size="icon" 
        onClick={handleLocationClick}
        className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-2xl hover:scale-110 transition-transform"
        aria-label="View location on map"
      >
        <MapPin className="h-6 w-6" />
      </Button>
      <Button 
        size="icon" 
        onClick={handleWhatsAppClick}
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-2xl hover:scale-110 transition-transform"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}

