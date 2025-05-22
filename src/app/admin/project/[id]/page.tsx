'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { ArrowLeft, Trash2, Save } from 'lucide-react';

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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        setMessage('Error fetching project.');
      } else {
        setProject(data);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (field: keyof Project, value: string | boolean) => {
    if (project) {
      setProject({ ...project, [field]: value });
      setSuccess(false);
      setMessage('');
    }
  };

  const handleSave = async () => {
    if (!project) return;
    setLoading(true);
    setMessage('');
    setSuccess(false);

    const { error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id);

    setLoading(false);

    if (error) {
      setMessage('❌ Failed to update project.');
      setSuccess(false);
    } else {
      setMessage('✅ Project updated successfully.');
      setSuccess(true);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this project?');
    if (!confirmed) return;

    const { error } = await supabase.from('projects').delete().eq('id', projectId);

    if (error) {
      alert('❌ Delete failed. Try again.');
    } else {
      alert('Project deleted.');
      router.push('/admin/dashboard');
    }
  };

  if (!project)
    return <p className="text-center mt-16 text-lg text-gray-500">Loading project...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 ml-3">Edit Project</h1>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-center font-semibold 
          ${success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form
        onSubmit={e => { e.preventDefault(); handleSave(); }}
        className="bg-white p-8 rounded-2xl shadow-2xl border border-blue-100 space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Client Name" value={project.client_name} onChange={val => handleChange('client_name', val)} />
          <Input label="Client Email" value={project.client_email} onChange={val => handleChange('client_email', val)} />
          <Input label="Business" value={project.business} onChange={val => handleChange('business', val)} />
          <Input label="Industry" value={project.industry} onChange={val => handleChange('industry', val)} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Goals" value={project.goals} onChange={val => handleChange('goals', val)} />
          <Input label="Pain Points" value={project.painpoints} onChange={val => handleChange('painpoints', val)} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Pages" value={project.pages} onChange={val => handleChange('pages', val)} />
          <Input label="Content" value={project.content} onChange={val => handleChange('content', val)} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Features" value={project.features} onChange={val => handleChange('features', val)} />
          <Input label="Design Preferences" value={project.design_prefs} onChange={val => handleChange('design_prefs', val)} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Examples / Competitor Sites" value={project.examples} onChange={val => handleChange('examples', val)} />
          <Input label="Mood / Branding" value={project.mood} onChange={val => handleChange('mood', val)} />
        </div>
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            name="admin_panel"
            checked={project.admin_panel}
            onChange={e => handleChange('admin_panel', e.target.checked)}
            className="mr-2 rounded border-gray-300"
          />
          <span className="text-gray-700">Client wants access to admin panel</span>
        </div>
        <Input label="Admin Notes (Internal Only)" value={project.admin_notes} onChange={val => handleChange('admin_notes', val)} />
        <Input label="Progress Update (Client will see this)" value={project.progress_update} onChange={val => handleChange('progress_update', val)} />

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition"
          >
            <Trash2 className="w-5 h-5" /> Delete Project
          </button>
        </div>
      </form>
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
      <label className="block font-semibold mb-1 text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 ring-blue-300 min-h-[44px] transition"
        rows={2}
      />
    </div>
  );
}
