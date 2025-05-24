'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClipboardList, PlusCircle, LogOut, Eye, Pencil } from 'lucide-react';
import AdminHubLoader from '@/components/AdminHubLoader';

interface Project {
  id: string;
  client_name: string;
  client_email: string;
  business: string;
  industry: string;
  progress_update: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [sending, setSending] = useState(false);
  const [selected, setSelected] = useState<number>(0); // Index in projects array
  const router = useRouter();

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

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('Failed to load projects.');
        return;
      }

      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Send Supabase magic link to client
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult('');
    const { client_email } = projects[selected];

    // Detect local/prod
    const redirectTo =
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3000/auth/callback'
        : 'https://adminhub.vercel.app/auth/callback';

    const { error } = await supabase.auth.signInWithOtp({
      email: client_email,
      options: {
        emailRedirectTo: redirectTo,
      }
    });

    if (error) {
      setResult('❌ Error: ' + error.message);
    } else {
      setResult('✅ Magic link sent! Client should check their email (inbox/spam).');
    }
    setSending(false);
  };

  if (loading) return <AdminHubLoader />;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-blue-700" />
          <h1 className="text-3xl font-bold text-gray-800">All Client Projects</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/create-project"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 transition font-semibold"
          >
            <PlusCircle className="w-5 h-5" /> New Project
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 shadow transition font-semibold"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      {/* Magic Link Sender */}
      {projects.length > 0 && (
        <form onSubmit={handleSendMagicLink} className="flex items-center gap-3 mb-8">
          <select
            className="border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
            value={selected}
            onChange={e => setSelected(Number(e.target.value))}
          >
            {projects.map((proj, idx) => (
              <option key={proj.id} value={idx}>
                {proj.client_name} ({proj.client_email})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={sending}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Magic Link"}
          </button>
          {result && (
            <span className="ml-2 text-sm">{result}</span>
          )}
        </form>
      )}

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="mt-16 text-center text-gray-600 text-lg">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-blue-200" />
          No projects available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2 hover:scale-[1.02] transition"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-lg font-semibold text-gray-700">
                  {project.business || project.client_name}
                </span>
                <span className="text-sm text-gray-500">
                  {project.industry ? `(${project.industry})` : ''}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1">
                <span className="font-medium text-gray-700">Client:</span> {project.client_name || 'N/A'}
              </p>
              <p className="text-gray-500 text-sm mb-1">
                <span className="font-medium text-gray-700">Email:</span> {project.client_email}
              </p>
              <div className="mt-1 mb-3">
                <span className="font-medium text-blue-700">Status:</span>{' '}
                <span className="text-gray-800">
                  {project.progress_update ? project.progress_update : <span className="text-gray-400">No updates yet.</span>}
                </span>
              </div>
              <div className="flex gap-4 mt-auto">
                <Link
                  href={`/admin/project/${project.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Link>
                <Link
                  href={`/admin/project/${project.id}/view`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                >
                  <Eye className="w-4 h-4" /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
