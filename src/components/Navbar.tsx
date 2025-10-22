'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-b from-black to-transparent z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logos/logo.png"
                alt="PR Auto Custom"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-white font-bold text-xl hidden sm:inline">PR Auto Custom</span>
            </Link>

            {/* Nuvana Branding */}
            <a
              href="https://www.nuvanaweb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
              title="Website by Nuvana"
            >
              <Image
                src="/images/nuvana-logo.jpg"
                alt="Nuvana"
                width={20}
                height={20}
                className="rounded"
              />
              <span className="text-gray-400 text-xs">Made by <span className="text-white font-medium">Nuvana</span></span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white hover:text-gray-300 transition">
              {t('nav.home')}
            </Link>
            <Link href="/visualizer" className="text-white hover:text-gray-300 transition">
              {t('nav.visualizer')}
            </Link>
            <Link href="/about" className="text-white hover:text-gray-300 transition">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="text-white hover:text-gray-300 transition">
              {t('nav.contact')}
            </Link>
          </div>

          {/* Right Side - Auth & Language */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-sm font-medium border border-white/20"
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
            <Link href="/visualizer" className="block py-2 text-white hover:text-gray-300">
              {t('nav.visualizer')}
            </Link>
            <Link href="/about" className="block py-2 text-white hover:text-gray-300">
              {t('nav.about')}
            </Link>
            <Link href="/contact" className="block py-2 text-white hover:text-gray-300">
              {t('nav.contact')}
            </Link>

            {/* Language Toggle in Mobile Menu */}
            <button
              onClick={toggleLanguage}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-sm font-medium text-left"
            >
              🌐 {i18n.language === 'en' ? 'Español (ES)' : 'English (EN)'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

