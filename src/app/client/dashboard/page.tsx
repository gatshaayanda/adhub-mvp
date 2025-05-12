'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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
        console.error("❌ Error fetching user:", userError);
        setError('User not authenticated.');
        router.push('/login');
        return;
      }

      console.log("👤 Fetched user:", user);
      console.log("🔍 Looking for projects where user_id =", user.id);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error("❌ Project fetch error:", error);
        setError('Error fetching projects.');
        setProjects([]);
      } else {
        console.log("📦 Projects returned:", data);
        setProjects(data);
      }

      setLoading(false);
    };

    fetchProjects();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Loading your projects...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (projects.length === 0) {
    return <p className="text-center mt-10 text-red-500">No project has been assigned to your account yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
      {projects.map((project, index) => (
        <div key={index} className="border p-4 rounded shadow mb-6 space-y-2">
          <p><strong>Client:</strong> {project.client_name}</p>
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
      ))}
    </div>
  );
}
