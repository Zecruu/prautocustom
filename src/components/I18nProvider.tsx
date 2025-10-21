'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init().then(() => setIsInitialized(true));
    } else {
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

