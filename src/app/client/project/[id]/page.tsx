'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import useRequireAuth from '@/hooks/useRequireAuth';
import AdminHubLoader from '@/components/AdminHubLoader';

interface Project {
  id: string;
  client_name: string;
  business: string;
  industry: string;
  goals: string;
  painpoints: string;
  pages: string;
  content: string;
  features: string;
  admin_panel: boolean;
  design_prefs: string;
  examples: string;
  mood: string;
  progress_update: string;
}

export default function ClientProjectDetails() {
  useRequireAuth();

  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid project ID.');
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError('You must be logged in to view this project.');
        setLoading(false);
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setError('Project not found or you are not authorized.');
      } else {
        setProject(data);
      }

      setLoading(false);
    };

    fetchProject();
  }, [id, router]);

  if (loading)  return <AdminHubLoader />;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!project) return null; // <--- THIS fixes your TS errors!

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Details</h1>
        <button
          onClick={() => router.push('/client/dashboard')}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="border p-4 rounded shadow space-y-2 bg-white">
        <ReadLine label="Business" value={project.business} />
        <ReadLine label="Industry" value={project.industry} />
        <ReadLine label="Goals" value={project.goals} />
        <ReadLine label="Pain Points" value={project.painpoints} />
        <ReadLine label="Pages" value={project.pages} />
        <ReadLine label="Content" value={project.content} />
        <ReadLine label="Features" value={project.features} />
        <ReadLine label="Admin Panel" value={project.admin_panel ? "Yes" : "No"} />
        <ReadLine label="Design Preferences" value={project.design_prefs} />
        <ReadLine label="Examples / Competitor Sites" value={project.examples} />
        <ReadLine label="Mood / Branding" value={project.mood} />
        <div>
          <span className="font-semibold text-blue-700 block mb-1">Progress Update:</span>
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 text-blue-900 text-base font-medium shadow-inner min-h-[44px]">
            {project.progress_update?.trim() || <span className="text-gray-400">No updates yet.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadLine({ label, value }: { label: string; value: string | boolean }) {
  return (
    <div>
      <span className="font-semibold text-gray-600">{label}:</span>{" "}
      <span className="text-gray-800">{value?.toString().trim() || <span className="text-gray-400">—</span>}</span>
    </div>
  );
}
