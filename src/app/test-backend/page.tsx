'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createProject, getMyProjects, healthCheck } from '@/lib/api';

export default function BackendTestPage() {
  const { user } = useAuth();
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  // Service type and requirements for creating a project
  const [serviceType, setServiceType] = useState<'website' | 'uiux' | 'branding' | 'app' | 'canva'>('website');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    // Check backend health on load
    checkHealth();
    
    // Get Firebase token if user is logged in
    if (user) {
      user.getIdToken().then(setToken).catch(console.error);
    }
  }, [user]);

  const checkHealth = async () => {
    try {
      const health = await healthCheck();
      setHealthStatus(health);
    } catch (err: any) {
      setError('Backend health check failed: ' + err.message);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in first');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await createProject(serviceType, requirements);
      console.log('Project created:', result);
      alert('Project created successfully!');
      setRequirements('');
      loadProjects(); // Reload projects
    } catch (err: any) {
      setError('Failed to create project: ' + err.message);
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
      setError('Failed to load projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Integration Test</h1>

        {/* Health Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Backend Health Check</h2>
          {healthStatus ? (
            <div className="text-green-600">
              ✅ Status: {healthStatus.status}
              <br />
              Message: {healthStatus.message}
              <br />
              Version: {healthStatus.version}
            </div>
          ) : (
            <div className="text-red-600">❌ Backend not responding</div>
          )}
        </div>

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

        {/* Create Project Form */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as any)}
                  className="w-full p-2 border rounded"
                  disabled={loading}
                >
                  <option value="website">Website Development</option>
                  <option value="uiux">UI/UX Design</option>
                  <option value="branding">Branding</option>
                  <option value="app">App Development</option>
                  <option value="canva">Canva Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Requirements</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Describe your project requirements..."
                  required
                  minLength={10}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        )}

        {/* My Projects */}
        {user && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Projects</h2>
              <button
                onClick={loadProjects}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Loading...' : 'Load Projects'}
              </button>
            </div>

            {projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold">#{project.id}</span>
                        <span className="ml-2 text-blue-600">{project.service_type_display}</span>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                        {project.status_display}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Brand: {project.brand_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No projects yet. Create one above!</p>
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
            To start backend: <code className="bg-white px-2 py-1 rounded">cd helix_backend && source venv/bin/activate && python manage.py runserver 8000</code>
          </p>
        </div>
      </div>
    </div>
  );
}
