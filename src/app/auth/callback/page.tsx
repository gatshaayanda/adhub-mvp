'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AdminHubLoader from '@/components/AdminHubLoader';

// ‼️ tell Next *never* to prerender this page
export const dynamic = 'force-dynamic';

export default function CallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      // 1.  Exchange the ?code=… in the URL for a session cookie
      const { error: exchangeErr } = await supabase
        .auth
        .exchangeCodeForSession(window.location.href);

      if (exchangeErr) {
        setError('Authentication failed.');
        return;
      }

      // 2.  Now we really have a session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('No session found.');
        return;
      }

      // 3.  Look up the user’s role in `profiles`
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('auth_id', session.user.id)   // column name in your table
        .single();

      if (profileErr || !profile) {
        setError('Profile/role missing.');
        return;
      }

      // 4.  Redirect by role
      router.replace(
        profile.role === 'Admin' ? '/admin/dashboard' : '/client/dashboard'
      );
    };

    run();
  }, [router, supabase]);

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return <AdminHubLoader />;
}
