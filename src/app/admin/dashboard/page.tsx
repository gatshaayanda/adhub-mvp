'use client';

import { useEffect, useState } from 'react';
import useRequireAuth from '@/hooks/useRequireAuth';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

export default function AdminDashboard() {
  useRequireAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !user) {
        setError('Authentication failed.');
        return;
      }

      const { data, error: fetchError } = await supabase.from('projects').select('*');

      if (fetchError) {
        setError('Failed to load projects.');
        return;
      }

      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading projects...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Client Projects</h1>
        <Link
          href="/admin/create-project"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="border p-4 rounded mb-4 bg-gray-50">
            <p><strong>Client:</strong> {project.client_name || 'N/A'}</p>
            <p><strong>Email:</strong> {project.client_email}</p>
            <p><strong>Business:</strong> {project.business}</p>
            <p><strong>Industry:</strong> {project.industry}</p>
            <Link
              href={`/admin/project/${project.id}`}
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View full project
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
