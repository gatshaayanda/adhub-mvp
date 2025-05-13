'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import useRequireAuth from '@/hooks/useRequireAuth';


export default function CreateProjectPage() {
useRequireAuth(); // 👈 This enforces the check

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [industry, setIndustry] = useState('');
  const [goals, setGoals] = useState('');
  const [painpoints, setPainpoints] = useState('');
  const [pages, setPages] = useState('');
  const [content, setContent] = useState('');
  const [features, setFeatures] = useState('');
  const [adminPanel, setAdminPanel] = useState(false);
  const [designPrefs, setDesignPrefs] = useState('');
  const [examples, setExamples] = useState('');
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    switch (name) {
      case 'client_name':
        setClientName(value);
        break;
      case 'client_email':
        setClientEmail(value);
        break;
      case 'business':
        setBusiness(value);
        break;
      case 'industry':
        setIndustry(value);
        break;
      case 'goals':
        setGoals(value);
        break;
      case 'painpoints':
        setPainpoints(value);
        break;
      case 'pages':
        setPages(value);
        break;
      case 'content':
        setContent(value);
        break;
      case 'features':
        setFeatures(value);
        break;
      case 'admin_panel':
        setAdminPanel(type === 'checkbox' ? checked : false);
        break;
      case 'design_prefs':
        setDesignPrefs(value);
        break;
      case 'examples':
        setExamples(value);
        break;
      case 'mood':
        setMood(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('auth_id')
      .eq('email', clientEmail)
      .single();

    if (profileError || !profile) {
      setMessage('❌ Client not found in profiles. Make sure they are registered and have a profile.');
      return;
    }

    const { error } = await supabase.from('projects').insert({
      user_id: profile.auth_id,
      client_name: clientName,
      client_email: clientEmail,
      business,
      industry,
      goals,
      painpoints,
      pages,
      content,
      features,
      admin_panel: adminPanel,
      design_prefs: designPrefs,
      examples,
      mood,
    });

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Project submitted and linked to client!');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Create Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="client_name" placeholder="Client Full Name" value={clientName} onChange={handleChange} className="w-full border px-3 py-2" />
        <input name="client_email" placeholder="Client Email" value={clientEmail} onChange={handleChange} className="w-full border px-3 py-2" />
        <input name="business" placeholder="Business Name" value={business} onChange={handleChange} className="w-full border px-3 py-2" />
        <input name="industry" placeholder="Industry" value={industry} onChange={handleChange} className="w-full border px-3 py-2" />
        <textarea name="goals" placeholder="Project Goals" value={goals} onChange={handleChange} className="w-full border px-3 py-2" />
        <textarea name="painpoints" placeholder="Pain Points" value={painpoints} onChange={handleChange} className="w-full border px-3 py-2" />
        <textarea name="pages" placeholder="Pages" value={pages} onChange={handleChange} className="w-full border px-3 py-2" />
        <textarea name="content" placeholder="Content" value={content} onChange={handleChange} className="w-full border px-3 py-2" />
        <textarea name="features" placeholder="Features" value={features} onChange={handleChange} className="w-full border px-3 py-2" />
        <label className="block">
          <input type="checkbox" name="admin_panel" checked={adminPanel} onChange={handleChange} className="mr-2" />
          Client wants access to admin panel
        </label>
        <textarea name="design_prefs" placeholder="Design Preferences" value={designPrefs} onChange={handleChange} className="w-full border px-3 py-2" />
        <textarea name="examples" placeholder="Examples / Inspiration" value={examples} onChange={handleChange} className="w-full border px-3 py-2" />
        <textarea name="mood" placeholder="Mood / Branding" value={mood} onChange={handleChange} className="w-full border px-3 py-2" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2">
          Submit Project
        </button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}
