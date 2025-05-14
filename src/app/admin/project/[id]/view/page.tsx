'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';

interface Project {
  id: string;
  client_name: string;
  business_name: string;
  industry: string;
  content: string;
  functionality: string;
  design_preferences: string;
  competitor_sites: string;
  mood: string;
  admin_notes: string;
  progress_update: string;
}

export default function ViewProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project:', error.message);
      } else {
        setProject(data);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) return <p className="text-center mt-10">Loading project...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Project Overview</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <ReadLine label="Client Name" value={project.client_name} />
        <ReadLine label="Business Name" value={project.business_name} />
        <ReadLine label="Industry" value={project.industry} />
        <ReadLine label="Content" value={project.content} />
        <ReadLine label="Functionality" value={project.functionality} />
        <ReadLine label="Design Preferences" value={project.design_preferences} />
        <ReadLine label="Competitor Sites" value={project.competitor_sites} />
        <ReadLine label="Mood / Branding" value={project.mood} />
        <ReadLine label="Admin Notes (Internal)" value={project.admin_notes} />
        <ReadLine label="Progress Update (Client Visible)" value={project.progress_update} />
      </div>
    </div>
  );
}

function ReadLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <p className="font-semibold w-64">{label}:</p>
      <p>{value?.trim() || <span className="text-gray-400">—</span>}</p>
    </div>
  );
}
