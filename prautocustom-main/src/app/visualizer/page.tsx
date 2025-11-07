'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductVisualizer } from '@/components/ProductVisualizer';

export default function VisualizerPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <ProductVisualizer />
      </div>
    </>
  );
}

