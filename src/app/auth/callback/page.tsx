'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import AdminHubLoader from '@/components/AdminHubLoader';

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        setError('Authentication failed.');
        return;
      }

      const userId = session.user.id;

      // The profile "id" column should match user.id from Supabase Auth
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError || !profile) {
        setError('Failed to fetch profile.');
        return;
      }

      // Redirect based on role
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
