'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';

interface Project {
  id: string;
  client_name: string;
  client_email: string;
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

  if (!project)
    return <p className="text-center mt-14 text-lg text-gray-500">Loading project...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <span className="text-2xl font-bold text-gray-700">Project Overview</span>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100 space-y-5">
        <ReadLine label="Client Name" value={project.client_name} />
        <ReadLine label="Client Email" value={project.client_email} />
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
        <ReadLine label="Admin Notes (Internal)" value={project.admin_notes} />
        <div>
          <span className="font-semibold text-blue-700 block mb-1">Progress Update (Client Visible):</span>
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
