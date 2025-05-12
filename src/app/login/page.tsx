'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback', // ✅ force redirect here
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('✅ Check your email for the magic link.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border">
      <h2 className="text-xl mb-4 font-semibold text-center">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2">
          Send Magic Link
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}
