'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

export default function AdminProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid project ID.');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setError('Project not found.');
      } else {
        setProject(data);
      }

      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading project...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>
      <div className="border p-4 rounded shadow space-y-2 bg-white">
        <p><strong>Client:</strong> {project.client_name}</p>
        <p><strong>Email:</strong> {project.client_email}</p>
        <p><strong>Business:</strong> {project.business}</p>
        <p><strong>Industry:</strong> {project.industry}</p>
        <p><strong>Goals:</strong> {project.goals}</p>
        <p><strong>Pain Points:</strong> {project.painpoints}</p>
        <p><strong>Pages:</strong> {project.pages}</p>
        <p><strong>Content:</strong> {project.content}</p>
        <p><strong>Features:</strong> {project.features}</p>
        <p><strong>Design Prefs:</strong> {project.design_prefs}</p>
        <p><strong>Examples:</strong> {project.examples}</p>
        <p><strong>Mood:</strong> {project.mood}</p>
        <p><strong>Admin Panel:</strong> {project.admin_panel ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
