'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import useRequireAuth from '@/hooks/useRequireAuth';

export default function ClientDashboard() {
  useRequireAuth(); // 👈 This enforces the check

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('❌ Error fetching user:', userError);
        setError('User not authenticated.');
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Project fetch error:', error);
        setError('Error fetching projects.');
        setProjects([]);
      } else {
        setProjects(data);
      }

      setLoading(false);
    };

    fetchProjects();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading your projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (projects.length === 0) return <p className="text-center mt-10 text-red-500">No project has been assigned to your account yet.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
      {projects.map((project) => (
        <div key={project.id} className="border p-4 rounded shadow mb-6 space-y-2">
          <p><strong>Client:</strong> {project.client_name}</p>
          <p><strong>Business:</strong> {project.business}</p>
          <p><strong>Industry:</strong> {project.industry}</p>
          <Link href={`/client/project/${project.id}`} className="text-blue-600 hover:underline">
            View More
          </Link>
        </div>
      ))}
    </div>
  );
}
