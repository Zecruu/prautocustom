"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";


interface Product {
  id: string;
  name: string;
  category: "rims" | "lights" | "accessories";
  image: string;
  price?: string;
}

const ALL_PRODUCTS: Product[] = [
  { id: "r1", name: "Chrome Multi-Spoke", category: "rims", image: "/images/4163b269-8817-4864-ad5c-b4c010ffb273.jpg", price: "$899" },
  { id: "r2", name: "Black Sport Mesh", category: "rims", image: "/images/becf64e6-b32e-42cc-9da0-2e0630357ff7.jpg", price: "$799" },
  { id: "r3", name: "Silver Split-Spoke", category: "rims", image: "/images/cfd7cdae-e500-4e73-b81f-fbe791e235b8.jpg", price: "$749" },
  { id: "r4", name: "Gunmetal Racing", category: "rims", image: "/images/f612cd15-1bfc-4c54-b41c-059ab0070079.jpg", price: "$829" },
  // Lights & Accessories can use existing images as placeholders; replace later with real assets

];

export default function ProductsPage() {
  const [active, setActive] = useState<"all" | Product["category"]>("all");

  const filtered = useMemo(() => {
    if (active === "all") return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter((p) => p.category === active);
  }, [active]);

  return (
    <main className="w-full bg-black min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Products</h1>
          <p className="text-gray-400 mt-2">Explore our selection of premium rims, lights, and accessories.</p>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <button onClick={() => setActive("all")} className={`px-4 py-2 rounded-full border ${active === "all" ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}>All</button>
            <button onClick={() => setActive("rims")} className={`px-4 py-2 rounded-full border ${active === "rims" ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}>Rims</button>
            <button onClick={() => setActive("lights")} className={`px-4 py-2 rounded-full border ${active === "lights" ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}>Lights</button>
            <button onClick={() => setActive("accessories")} className={`px-4 py-2 rounded-full border ${active === "accessories" ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/10 hover:bg-white/10"}`}>Accessories</button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-10">
              No products in this category yet.
            </div>
          )}
          {filtered.map((p) => (
            <div key={p.id} className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-video">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <div className="p-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-white font-semibold text-lg">{p.name}</h3>
                  <p className="text-gray-400 text-sm capitalize">{p.category}</p>
                </div>
                {p.price && <span className="text-white font-bold">{p.price}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>


    </main>
  );
}

