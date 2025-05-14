'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ClientDashboard() {
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <p className="text-center mt-10">Loading your projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (projects.length === 0) return <p className="text-center mt-10">No project has been assigned to your account yet.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="border p-4 rounded shadow mb-6 space-y-2">
          <p><strong>Client:</strong> {project.client_name}</p>
          <p><strong>Industry:</strong> {project.industry}</p>
          <p><strong>Status:</strong> {project.progress_update || '—'}</p>
          <Link href={`/client/project/${project.id}`} className="text-blue-600 hover:underline">
            View More
          </Link>
        </div>
      ))}
    </div>
  );
}
