'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const user = session?.user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-b from-black to-transparent z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logos/Logo Blanco.png"
                alt="PR Auto Custom"
                width={50}
                height={50}
                className="object-contain"
              />
            </Link>


          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-gray-300 transition">
              {t('nav.home')}
            </Link>
            <Link href="/products" className="text-white hover:text-gray-300 transition">
              {t('nav.products')}
            </Link>
          </div>

          {/* Right Side - Cart, Auth & Language */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              href="/checkout"
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              title="View Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-sm font-medium border border-white/20"
              title={i18n.language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
            >
              🌐 {i18n.language === 'en' ? 'ES' : 'EN'}
            </button>

            {/* Auth Links */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="text-white hover:text-gray-300 transition">
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition font-medium"
                >
                  {t('nav.signUp')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-4">
            <Link href="/" className="block py-2 text-white hover:text-gray-300">
              {t('nav.home')}
            </Link>
            <Link href="/products" className="block py-2 text-white hover:text-gray-300">
              {t('nav.products')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

