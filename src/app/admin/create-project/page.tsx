'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import useRequireAuth from '@/hooks/useRequireAuth';
import { ClipboardList, SendHorizonal } from 'lucide-react';

export default function CreateProjectPage() {
  useRequireAuth();

  // States
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
  const [adminNotes, setAdminNotes] = useState('');
  const [progressUpdate, setProgressUpdate] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'client_name': setClientName(value); break;
      case 'client_email': setClientEmail(value); break;
      case 'business': setBusiness(value); break;
      case 'industry': setIndustry(value); break;
      case 'goals': setGoals(value); break;
      case 'painpoints': setPainpoints(value); break;
      case 'pages': setPages(value); break;
      case 'content': setContent(value); break;
      case 'features': setFeatures(value); break;
      case 'design_prefs': setDesignPrefs(value); break;
      case 'examples': setExamples(value); break;
      case 'mood': setMood(value); break;
      case 'admin_notes': setAdminNotes(value); break;
      case 'progress_update': setProgressUpdate(value); break;
      default: break;
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminPanel(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('auth_id')
      .eq('email', clientEmail)
      .single();

    if (profileError || !profile) {
      setMessage('❌ Client not found in profiles. Make sure they are registered and have a profile.');
      setSuccess(false);
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
      admin_notes: adminNotes,
      progress_update: progressUpdate,
    });

    setMessage(error ? `❌ Error: ${error.message}` : '✅ Project submitted and linked to client!');
    setSuccess(!error);
    if (!error) {
      setClientName('');
      setClientEmail('');
      setBusiness('');
      setIndustry('');
      setGoals('');
      setPainpoints('');
      setPages('');
      setContent('');
      setFeatures('');
      setAdminPanel(false);
      setDesignPrefs('');
      setExamples('');
      setMood('');
      setAdminNotes('');
      setProgressUpdate('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-14 px-4">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList className="w-8 h-8 text-blue-700" />
        <h1 className="text-3xl font-bold text-gray-800">Create New Project</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl border border-blue-100 space-y-4"
      >
        {/* Core info */}
        <div className="grid md:grid-cols-2 gap-6">
          <input name="client_name" placeholder="Client Full Name" value={clientName} onChange={handleChange} required
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300" />
          <input name="client_email" placeholder="Client Email" value={clientEmail} onChange={handleChange} required
            type="email" className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300" />
          <input name="business" placeholder="Business Name" value={business} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300" />
          <input name="industry" placeholder="Industry" value={industry} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300" />
        </div>

        {/* Goals, Pain Points, Features */}
        <div className="grid md:grid-cols-2 gap-6">
          <textarea name="goals" placeholder="Project Goals" value={goals} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />
          <textarea name="painpoints" placeholder="Pain Points" value={painpoints} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <textarea name="pages" placeholder="Pages" value={pages} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />
          <textarea name="content" placeholder="Content" value={content} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <textarea name="features" placeholder="Features" value={features} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />
          <textarea name="design_prefs" placeholder="Design Preferences" value={designPrefs} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <textarea name="examples" placeholder="Examples / Inspiration" value={examples} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />
          <textarea name="mood" placeholder="Mood / Branding" value={mood} onChange={handleChange}
            className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />
        </div>
        {/* Admin Panel */}
        <div className="flex items-center mb-2">
          <input type="checkbox" name="admin_panel" checked={adminPanel} onChange={handleCheckboxChange}
            className="mr-2 rounded border-gray-300" />
          <span className="text-gray-700">Client wants access to admin panel</span>
        </div>
        {/* Admin notes and progress */}
        <textarea name="admin_notes" placeholder="Admin Notes (Internal Only)" value={adminNotes} onChange={handleChange}
          className="w-full border px-3 py-2 rounded-xl bg-gray-100 focus:ring-2 ring-blue-300 min-h-[48px]" />
        <textarea name="progress_update" placeholder="Progress Update (Client will see this)" value={progressUpdate} onChange={handleChange}
          className="w-full border px-3 py-2 rounded-xl focus:ring-2 ring-blue-300 min-h-[48px]" />

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow transition mt-2"
        >
          <SendHorizonal className="w-5 h-5" /> Submit Project
        </button>
      </form>
      {message && (
        <div className={`mt-6 px-4 py-3 rounded-xl text-center font-semibold
          ${success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
