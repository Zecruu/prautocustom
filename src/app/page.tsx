'use client';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProductVisualizer } from '@/components/ProductVisualizer';

export default function Home() {
  return (
    <main className="w-full bg-black">
      <Navbar />
      <Hero />
      <ProductVisualizer />
    </main>
  );
}
