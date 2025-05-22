'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Get site URL from environment, fallback to localhost
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
    } else {
      setMessage('✅ Check your email for the magic link!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-blue-100">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-12 w-full max-w-sm border border-blue-100">
        <div className="flex flex-col items-center mb-8">
          <Lock className="w-12 h-12 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-blue-800 mb-1">AdminHub Login</h2>
          <p className="text-gray-500 text-sm">Enter your email to receive a magic link</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 w-full text-gray-700 bg-blue-50 transition"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
          >
            Send Magic Link
          </button>
        </form>
        {message && (
          <div className={`mt-6 text-center rounded-xl py-2 px-3 font-semibold ${
            message.startsWith('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
