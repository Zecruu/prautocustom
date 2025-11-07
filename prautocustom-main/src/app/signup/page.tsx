'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { signIn } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';

export default function SignUp() {
  const { t } = useTranslation();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);

      // Create user account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }

      // Auto sign in after successful signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but failed to sign in. Please sign in manually.');
        router.push('/signin');
      } else {
        router.push('/profile');
      }
    } catch {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/profile' });
    } catch {
      setError('Failed to sign up with Google');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              {t('auth.signUp')}
            </h1>
            <p className="text-gray-400 text-center mb-6">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/signin" className="text-white hover:underline">
                {t('auth.signIn')}
              </Link>
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">{t('auth.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">{t('auth.password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">{t('auth.confirmPassword')}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-white to-gray-200 text-black font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : t('auth.signUp')}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-3 text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {t('auth.signInWithGoogle')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

