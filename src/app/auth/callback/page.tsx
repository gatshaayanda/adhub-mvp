/* ----  auth/callback/page.tsx  ---- */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import AdminHubLoader from '@/components/AdminHubLoader';

export const dynamic = 'force-dynamic';   // still required – no prerender

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      const code = new URL(window.location.href).searchParams.get('code');
      if (!code) return setError('No code found in URL.');

      // helper → tries exchange, returns {session,error}
      const tryExchange = () =>
        supabase.auth.exchangeCodeForSession(code);

      /* 1 ▸ first attempt ────────────────────────────── */
      let { data, error } = await tryExchange();

      /* 2 ▸ if we hit the “both auth header & cookie” problem, clear cookie only and retry */
      if (
        error?.status === 400 &&
        error.message?.includes('both authorization header and cookie present')
      ) {
        // delete the sb-access-token cookie (name pattern: sb-{projectId}-auth-token)
        document.cookie
          .split(';')
          .filter(c => c.trim().includes('sb-') && c.includes('-auth-token'))
          .forEach(c => {
            const name = c.split('=')[0];
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          });

        ({ data, error } = await tryExchange());
      }

      if (error || !data.session) {
        setError('Authentication failed.');
        return;
      }

      /* 3 ▸ fetch profile & redirect */
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (profile?.role === 'Admin') router.push('/admin/dashboard');
      else if (profile?.role === 'Client') router.push('/client/dashboard');
      else setError('No valid role found.');
    };

    run();
  }, [router]);

  return error ? (
    <p className="text-red-500 text-center mt-10">{error}</p>
  ) : (
    <AdminHubLoader />
  );
}
