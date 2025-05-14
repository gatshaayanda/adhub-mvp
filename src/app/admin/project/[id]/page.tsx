'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';

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

interface Props {
  params: {
    id: string;
  };
}

export default function AdminProjectEditPage({ params }: Props) {
  const router = useRouter();
  const projectId = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  const handleChange = (field: keyof Project, value: string) => {
    if (project) {
      setProject({ ...project, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!project) return;

    setLoading(true);
    const { error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id);

    setLoading(false);

    if (error) {
      console.error('Update error:', error.message);
      setMessage('Failed to update project.');
    } else {
      setMessage('Project updated successfully.');
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    const { error } = await supabase.from('projects').delete().eq('id', projectId);

    if (error) {
      console.error('Failed to delete project:', error.message);
      alert('Delete failed. Try again.');
    } else {
      alert('Project deleted.');
      router.push('/admin/dashboard');
    }
  };

  if (!project) return <p>Loading project...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="space-y-4">
        <Input label="Client Name" value={project.client_name} onChange={(val) => handleChange('client_name', val)} />
        <Input label="Business Name" value={project.business_name} onChange={(val) => handleChange('business_name', val)} />
        <Input label="Industry" value={project.industry} onChange={(val) => handleChange('industry', val)} />
        <Input label="Content" value={project.content} onChange={(val) => handleChange('content', val)} />
        <Input label="Functionality" value={project.functionality} onChange={(val) => handleChange('functionality', val)} />
        <Input label="Design Preferences" value={project.design_preferences} onChange={(val) => handleChange('design_preferences', val)} />
        <Input label="Competitor Sites" value={project.competitor_sites} onChange={(val) => handleChange('competitor_sites', val)} />
        <Input label="Mood/Branding" value={project.mood} onChange={(val) => handleChange('mood', val)} />
        <Input label="Admin Notes (Internal)" value={project.admin_notes} onChange={(val) => handleChange('admin_notes', val)} />
        <Input label="Progress Update (Client Visible)" value={project.progress_update} onChange={(val) => handleChange('progress_update', val)} />
      </div>

      {/* ✅ BACK BUTTON ADDED HERE */}
      <div className="mt-6">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Project
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        rows={2}
      />
    </div>
  );
}
