'use client';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { WorkShowcase } from '@/components/WorkShowcase';
import { MapWidget } from '@/components/MapWidget';

export default function Home() {
  return (
    <main className="w-full bg-black">
      <Navbar />
      <Hero />
      <WorkShowcase />
      <MapWidget />
    </main>
  );
}
