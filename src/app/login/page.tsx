'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Detect local/prod environment for redirect URL
  const getRedirectTo = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3000/auth/callback';
    }
    return 'https://adminhub.vercel.app/auth/callback';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getRedirectTo(),
      }
    });
    if (error) {
      setMessage('Failed to send magic link: ' + error.message);
    } else {
      setMessage('✅ Magic link sent! Check your email.');
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <form onSubmit={handleLogin} className="bg-white shadow-xl rounded-2xl p-10 flex flex-col items-center w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-2 text-blue-700">AdminHub Login</h2>
        <p className="text-gray-600 mb-6 text-center">Enter your email to receive a magic link</p>
        <input
          type="email"
          className="border rounded-xl px-3 py-2 text-sm w-full mb-4"
          placeholder="you@email.com"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold w-full disabled:opacity-70"
        >
          {sending ? 'Sending...' : 'Send Magic Link'}
        </button>
        {message && <div className="text-sm text-center mt-4">{message}</div>}
      </form>
    </div>
  );
}
