// src/app/auth/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import AdminHubLoader from '@/components/AdminHubLoader';

export const dynamic = 'force-dynamic'; // don’t pre-render

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      // 1️⃣ swap the ?code=… in the URL for a Supabase session
      const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );
      if (exchangeErr) {
        setError('Authentication failed.');
        return;
      }

      // 2️⃣ grab the session we just created
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Authentication failed.');
        return;
      }

      // 3️⃣ look up the user’s role
      const { data, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileErr || !data) {
        setError('Failed to fetch profile.');
        return;
      }

      router.push(
        data.role === 'Admin' ? '/admin/dashboard' : '/client/dashboard'
      );
    };

    run();
  }, [router]);

  return error ? (
    <p className="text-red-500 text-center mt-10">{error}</p>
  ) : (
    <AdminHubLoader />
  );
}
