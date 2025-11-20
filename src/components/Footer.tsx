'use client';

import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* PR Auto Custom Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/logo-150x150.png"
              alt="PR Auto Custom - Premium Custom Rims & Wheels in Puerto Rico"
              width={150}
              height={150}
              className="object-contain"
              priority={false}
            />
          </Link>

          {/* Footer Bottom Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} PR Auto Custom. All rights reserved.</p>
            <Link
              href="https://www.nexulonllc.com/en"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              <Image
                src="/images/NEXULON LOGO.png"
                alt="Nexulon logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <span className="text-gray-400 text-xs">Powered by <span className="text-white font-medium">Nexulon</span></span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

