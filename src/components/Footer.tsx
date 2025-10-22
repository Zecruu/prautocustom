'use client';

import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} PR Auto Custom. All rights reserved.</p>
        <Link
          href="https://www.nuvanaweb.com/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
        >
          <Image
            src="/images/Nuvana%20Logo.jpg"
            alt="Nuvana"
            width={20}
            height={20}
            className="rounded"
          />
          <span className="text-gray-400 text-xs">Made by <span className="text-white font-medium">Nuvana</span></span>
        </Link>
      </div>
    </footer>
  );
};

