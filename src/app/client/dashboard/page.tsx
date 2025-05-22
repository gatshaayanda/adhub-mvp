'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { LayoutDashboard, LogOut, Briefcase, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  client_name: string;
  business: string;
  industry: string;
  progress_update: string;
}

export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
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
        setError('User not authenticated.');
        router.push('/login');
        return;
      }

      // NEWEST PROJECTS FIRST, guaranteed to work
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
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

  if (loading)
    return <p className="text-center mt-10 text-lg text-gray-500">Loading your projects...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (projects.length === 0)
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <LayoutDashboard className="mx-auto mb-2 w-10 h-10 text-blue-500" />
        <p className="text-xl text-gray-600 font-medium">No project has been assigned to your account yet.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Your Projects</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 shadow transition font-semibold"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 flex flex-col gap-3 transition hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-700">{project.business || project.client_name}</span>
            </div>
            <p className="text-gray-500 mb-1">{project.industry}</p>
            <div className="mb-2">
              <span className="font-medium text-blue-700">Status:</span>{" "}
              <span className="text-gray-800">
                {project.progress_update ? project.progress_update : <span className="text-gray-400">No updates yet.</span>}
              </span>
            </div>
            <Link
              href={`/client/project/${project.id}`}
              className="mt-auto inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline hover:text-blue-800 transition"
            >
              View Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
