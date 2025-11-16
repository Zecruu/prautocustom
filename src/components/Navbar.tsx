'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ShoppingCart, Menu, User, LogOut, Globe } from 'lucide-react';

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
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logos/Logo Blanco.png"
                alt="PR Auto Custom"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Button variant="ghost" asChild className="text-foreground hover:text-primary">
              <Link href="/">{t('nav.home')}</Link>
            </Button>
            <Button variant="ghost" asChild className="text-foreground hover:text-primary">
              <Link href="/products">{t('nav.products')}</Link>
            </Button>
          </div>

          {/* Right Side - Cart, Auth & Language */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/checkout" title="View Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title={i18n.language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}>
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover">
                <DropdownMenuItem onClick={() => i18n.changeLanguage('en')} className="cursor-pointer">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => i18n.changeLanguage('es')} className="cursor-pointer">
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Links */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile" title={t('nav.profile')}>
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/signin">{t('nav.signIn')}</Link>
                </Button>
                <Button variant="default" size="sm" asChild className="bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/signup">{t('nav.signUp')}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Sheet */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background">
                <div className="flex flex-col gap-4 mt-8">
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                      {t('nav.home')}
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/products" onClick={() => setIsMenuOpen(false)}>
                      {t('nav.products')}
                    </Link>
                  </Button>

                  {user ? (
                    <>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          {t('nav.profile')}
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="justify-start"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('nav.logout')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                          {t('nav.signIn')}
                        </Link>
                      </Button>
                      <Button variant="default" asChild className="justify-start bg-foreground text-background">
                        <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                          {t('nav.signUp')}
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

