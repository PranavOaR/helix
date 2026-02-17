'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createProject, getMyProjects } from '@/lib/api';

export default function BackendTestPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  // Fields for creating a request
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');

  useEffect(() => {
    if (user) {
      user.getIdToken().then(setToken).catch(console.error);
    }
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await createProject(title, description, priority);
      console.log('Request created:', result);
      alert('Request created successfully!');
      setTitle('');
      setDescription('');
      loadProjects();
    } catch (err: any) {
      setError('Failed to create request: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    if (!user) {
      setError('Please log in first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userProjects = await getMyProjects();
      setProjects(userProjects);
    } catch (err: any) {
      setError('Failed to load requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Integration Test</h1>

        {/* User Auth Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {user ? (
            <div className="text-green-600">
              ✅ Logged in as: {user.email}
              <br />
              <div className="mt-2 text-xs text-gray-500 break-all">
                <strong>Firebase Token:</strong>
                <br />
                <code className="bg-gray-100 p-2 block rounded mt-1">
                  {token.substring(0, 50)}...
                </code>
              </div>
            </div>
          ) : (
            <div className="text-red-600">
              ❌ Not logged in. Please go to <a href="/auth" className="text-blue-500 underline">/auth</a> to log in.
            </div>
          )}
        </div>

        {/* Create Request Form */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Request</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Request title..."
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Describe your request (min 10 characters)..."
                  required
                  minLength={10}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2 border rounded"
                  disabled={loading}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            </form>
          </div>
        )}

        {/* My Requests */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Requests</h2>
              <button
                onClick={loadProjects}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Loading...' : 'Load Requests'}
              </button>
            </div>

            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold">#{project.id}</span>
                        <span className="ml-2 text-blue-600">{project.title}</span>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                        {project.status_display || project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {project.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Priority: {project.priority} · Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No requests yet. Create one above!</p>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Backend Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Backend Information</h3>
          <p className="text-sm text-gray-700">
            Backend URL: <code className="bg-white px-2 py-1 rounded">http://localhost:8000</code>
          </p>
          <p className="text-sm text-gray-700 mt-2">
            To start backend: <code className="bg-white px-2 py-1 rounded">cd helix_backend && python manage.py runserver 8000</code>
          </p>
        </div>
      </div>
    </div>
  );
}
