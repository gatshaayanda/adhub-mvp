'use client';

export const dynamic = 'force-dynamic';


import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import AdminHubLoader from '@/components/AdminHubLoader';

export default function CallbackPage() {
  const router       = useRouter();
  const params       = useSearchParams();          // ?code=…
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      /* 1️⃣  If the magic-link delivered a PKCE code, exchange it first. */
      const code = params.get('code');
      if (code) {
        const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
        if (exErr) {
          setError('Authentication failed.');
          return;
        }
      }

      /* 2️⃣  Now the cookie exists (or the user was already logged in)   */
      const {
        data: { session },
        error: sessionErr,
      } = await supabase.auth.getSession();

      if (sessionErr || !session) {
        setError('Authentication failed.');
        return;
      }

      /* 3️⃣  Look up the user’s role in the profiles table               */
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileErr || !profile) {
        setError('Failed to fetch profile.');
        return;
      }

      /* 4️⃣  Route them to the right dashboard                           */
      switch (profile.role) {
        case 'Admin':
          router.push('/admin/dashboard');
          break;
        case 'Client':
          router.push('/client/dashboard');
          break;
        default:
          setError('No valid role found.');
      }
    };

    handleRedirect();
  }, [router, params]);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return <AdminHubLoader />;
}
