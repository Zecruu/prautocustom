'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Cookie, Shield } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const cookieTranslations = {
  en: {
    title: 'We use cookies',
    description: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
    acceptAll: 'Accept All',
    acceptNecessary: 'Necessary Only',
    settings: 'Cookie Settings',
    necessary: 'Necessary',
    necessaryDesc: 'Essential for the website to function properly.',
    analytics: 'Analytics',
    analyticsDesc: 'Help us understand how visitors interact with our website.',
    marketing: 'Marketing',
    marketingDesc: 'Used to deliver personalized advertisements.',
    savePreferences: 'Save Preferences',
  },
  es: {
    title: 'Usamos cookies',
    description: 'Usamos cookies para mejorar tu experiencia de navegación, servir contenido personalizado y analizar nuestro tráfico. Al hacer clic en "Aceptar Todo", consientes el uso de cookies.',
    acceptAll: 'Aceptar Todo',
    acceptNecessary: 'Solo Necesarias',
    settings: 'Configuración de Cookies',
    necessary: 'Necesarias',
    necessaryDesc: 'Esenciales para que el sitio web funcione correctamente.',
    analytics: 'Analíticas',
    analyticsDesc: 'Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio.',
    marketing: 'Marketing',
    marketingDesc: 'Usadas para mostrar anuncios personalizados.',
    savePreferences: 'Guardar Preferencias',
  },
};

export function CookieConsent() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const t = cookieTranslations[lang];
  
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch {
        // Invalid data, show banner again
        setIsVisible(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setIsVisible(false);
    
    // Enable analytics if accepted
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
      });
    }
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    setPreferences(necessaryOnly);
    setIsVisible(false);
    
    // Deny analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
    setShowSettings(false);
    
    // Update consent based on preferences
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: preferences.analytics ? 'granted' : 'denied',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop for settings modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Main Cookie Banner */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-500 ${
          showSettings ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border-t border-yellow-500/30 shadow-2xl shadow-black/50">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              {/* Icon and Text */}
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-yellow-500/10 rounded-lg shrink-0">
                  <Cookie className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    {t.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 max-w-2xl">
                    {t.description}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
                >
                  {t.settings}
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                >
                  {t.acceptNecessary}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 text-sm font-semibold text-black bg-yellow-500 hover:bg-yellow-400 rounded-lg transition-colors"
                >
                  {t.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:bottom-8 sm:w-full sm:max-w-lg z-[9999]">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-white font-semibold">{t.settings}</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cookie Options */}
            <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 bg-zinc-800/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{t.necessary}</h4>
                  <p className="text-gray-400 text-sm mt-0.5">{t.necessaryDesc}</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="sr-only"
                  />
                  <div className="w-10 h-6 bg-yellow-500 rounded-full opacity-50 cursor-not-allowed">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 bg-zinc-800/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{t.analytics}</h4>
                  <p className="text-gray-400 text-sm mt-0.5">{t.analyticsDesc}</p>
                </div>
                <button
                  onClick={() => setPreferences((p: CookiePreferences) => ({ ...p, analytics: !p.analytics }))}
                  className="relative shrink-0"
                >
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    preferences.analytics ? 'bg-yellow-500' : 'bg-zinc-600'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                      preferences.analytics ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 bg-zinc-800/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{t.marketing}</h4>
                  <p className="text-gray-400 text-sm mt-0.5">{t.marketingDesc}</p>
                </div>
                <button
                  onClick={() => setPreferences((p: CookiePreferences) => ({ ...p, marketing: !p.marketing }))}
                  className="relative shrink-0"
                >
                  <div className={`w-10 h-6 rounded-full transition-colors ${
                    preferences.marketing ? 'bg-yellow-500' : 'bg-zinc-600'
                  }`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                      preferences.marketing ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </div>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-lg transition-colors"
              >
                {t.acceptNecessary}
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-black bg-yellow-500 hover:bg-yellow-400 rounded-lg transition-colors"
              >
                {t.savePreferences}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: Record<string, string>) => void;
  }
}

