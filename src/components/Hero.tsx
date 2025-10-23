'use client';

import React from 'react';

export const Hero: React.FC = () => {

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/PR-AUTO-CUSTOM-CAR.png)',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
        }}
      />

      {/* Dark Overlay - Lighter to show image better */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Animated Mouse Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          {/* Mouse Icon */}
          <div className="w-8 h-12 border-3 border-white rounded-full relative animate-bounce">
            {/* Scroll Wheel */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white rounded-full animate-scroll"></div>
          </div>
          {/* Scroll Text */}
          <span className="text-white text-sm font-medium tracking-wider opacity-80">SCROLL</span>
        </div>
      </div>
    </section>
  );
};

