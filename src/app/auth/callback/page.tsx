'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import AdminHubLoader from '@/components/AdminHubLoader';

export default function CallbackPage() {
  const router      = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    /* 1️⃣  Grab the ?code= from the URL – no React hook needed   */
    const code = new URLSearchParams(window.location.search).get('code');

    const handleRedirect = async () => {
      /* 2️⃣  First-time visit: exchange code → session cookie     */
      if (code) {
        const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
        if (exErr) {
          setError('Authentication failed.');
          return;
        }
      }

      /* 3️⃣  Get session and role                                */
      const { data: { session }, error: sErr } = await supabase.auth.getSession();
      if (sErr || !session) {
        setError('Authentication failed.');
        return;
      }

      const { data: profile, error: pErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (pErr || !profile) {
        setError('Failed to fetch profile.');
        return;
      }

      /* 4️⃣  Route                                                */
      if (profile.role === 'Admin') {
        router.push('/admin/dashboard');
      } else if (profile.role === 'Client') {
        router.push('/client/dashboard');
      } else {
        setError('No valid role found.');
      }
    };

    handleRedirect();
  }, [router]);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return <AdminHubLoader />;
}
