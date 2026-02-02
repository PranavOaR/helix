/**
 * Helix Backend API Integration
 * 
 * This file contains all API calls to the Django backend.
 * Includes global error handling and centralized fetch logic.
 */

import { getAuth, signOut } from 'firebase/auth';

const API_BASE_URL = 'http://localhost:8000/api';

// --- Types ---

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
}

export interface ProjectRequest {
  id: number;
  service_type: string;
  status: "PENDING" | "ACCEPTED" | "IMPLEMENTING" | "COMPLETED" | "REJECTED";
  created_at: string;
  requirements_text: string;
  user_email?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

// --- Helpers ---

/**
 * Get Firebase ID token from current user
 */
export async function getAuthToken(): Promise<string> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User not authenticated');
  }

  return await user.getIdToken();
}

/**
 * Centralized fetch with Auth & Error Handling
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  try {
    const token = await getAuthToken();

    // --- Dev Mode Bypass ---
    if (token === 'dev-token') {
      console.log(`[Dev Mode] Mocking request to: ${endpoint}`);
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate latency

      // Mock Data Routing
      if (endpoint === '/projects/create/') {
        const body = JSON.parse(options.body as string);
        return {
          success: true,
          message: 'Project created successfully (Dev Mode)',
          project: {
            id: Math.floor(Math.random() * 1000),
            brand: 1,
            brand_name: 'Dev Brand',
            brand_email: 'user@local',
            service_type: body.service_type,
            requirements_text: body.requirements_text,
            status: 'submitted',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
      }

      if (endpoint === '/projects/my-projects/') {
        return {
          success: true,
          count: 3,
          projects: [
            {
              id: 101,
              brand_name: 'Dev User Brand',
              service_type: 'website',
              service_type_display: 'Website Development',
              status: 'submitted',
              status_display: 'Submitted',
              created_at: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 102,
              brand_name: 'Dev User Brand',
              service_type: 'app',
              service_type_display: 'Mobile App',
              status: 'in_progress',
              status_display: 'In Progress',
              created_at: new Date(Date.now() - 172800000).toISOString()
            },
            {
              id: 103,
              brand_name: 'Dev User Brand',
              service_type: 'uiux',
              service_type_display: 'UI/UX Design',
              status: 'completed',
              status_display: 'Completed',
              created_at: new Date(Date.now() - 259200000).toISOString()
            }
          ]
        };
      }

      if (endpoint === '/projects/user/profile/') {
        const isDevAdmin = localStorage.getItem('helix_dev_mode') === 'admin';
        return {
          email: isDevAdmin ? 'admin@local' : 'user@local',
          brand_name: isDevAdmin ? 'Dev Admin Brand' : 'Dev User Brand',
          role: isDevAdmin ? 'ADMIN' : 'USER'
        };
      }

      if (endpoint === '/projects/all/') {
        return {
          success: true,
          count: 5,
          projects: [
            {
              id: 101,
              brand_name: 'Alice Corp',
              service_type: 'website',
              service_type_display: 'Website Development',
              status: 'submitted',
              status_display: 'Submitted',
              created_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 102,
              brand_name: 'Bob Inc',
              service_type: 'branding',
              service_type_display: 'Branding',
              status: 'in_review',
              status_display: 'In Review',
              created_at: new Date(Date.now() - 7200000).toISOString()
            },
            {
              id: 103,
              brand_name: 'Charlie Co',
              service_type: 'app',
              service_type_display: 'Mobile App',
              status: 'in_progress',
              status_display: 'In Progress',
              created_at: new Date(Date.now() - 10800000).toISOString()
            },
            {
              id: 104,
              brand_name: 'Delta Group',
              service_type: 'uiux',
              service_type_display: 'UI/UX Design',
              status: 'completed',
              status_display: 'Completed',
              created_at: new Date(Date.now() - 14400000).toISOString()
            },
            {
              id: 105,
              brand_name: 'Echo Ltd',
              service_type: 'canva',
              service_type_display: 'Canva Design',
              status: 'rejected',
              status_display: 'Rejected',
              created_at: new Date(Date.now() - 18000000).toISOString()
            }
          ]
        };
      }

      if (endpoint.includes('/update-status/')) {
        const body = JSON.parse(options.body as string);
        return {
          success: true,
          message: 'Status updated successfully (Dev Mode)',
          project: {
            id: 123,
            status: body.status,
            // simplified return
          }
        }
      }

      throw new Error(`[Dev Mode] Endpoint not mocked: ${endpoint}`);
    }

    // --- End Dev Mode Bypass ---

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Global Error Handling
    if (response.status === 401) {
      // Only logout if it's truly an auth error, not a connection issue
      const text = await response.text();
      if (text.includes('auth') || text.includes('token')) {
        console.warn("Unauthorized (401) - Logging out");
        const auth = getAuth();
        await signOut(auth);
        window.location.href = '/'; // Hard redirect to login
        throw new Error("Session expired. Please login again.");
      }
      throw new Error("Backend authentication error. Please try again.");
    }

    if (response.status === 403) {
      console.warn("Forbidden (403) - Access denied");
      throw new Error("You do not have permission to perform this action.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    // Don't logout on network errors
    if (error.message && !error.message.includes('Session expired')) {
      console.error(`API Request Failed: ${endpoint}`, error);
    }
    throw error;
  }
}

// --- Public APIs ---

/**
 * Get available services (Mock or Real)
 */
export async function getServices(): Promise<Service[]> {
  try {
    // Check basic connectivity first if real endpoint exists
    /* 
    return await fetchWithAuth('/services/', { method: 'GET' });
    */

    // Fallback Mock Data as per requirements
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network
    return [
      { id: "website", name: "Website Development", description: "Custom performant websites", icon: "Globe" },
      { id: "uiux", name: "UI/UX Design", description: "User-centric interface design", icon: "Palette" },
      { id: "branding", name: "Branding", description: "Logo and brand identity", icon: "Flag" },
      { id: "app", name: "Mobile App", description: "iOS and Android apps", icon: "Smartphone" },
      { id: "canva", name: "Canva Design", description: "Social media templates", icon: "Layout" },
    ];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Create a new project request
 */
export async function createProject(
  serviceType: string,
  requirementsText: string
) {
  return await fetchWithAuth('/projects/create/', {
    method: 'POST',
    body: JSON.stringify({
      service_type: serviceType,
      requirements_text: requirementsText,
    }),
  });
}

/**
 * Get all projects for the authenticated user
 */
export async function getMyProjects(): Promise<ProjectRequest[]> {
  const data = await fetchWithAuth('/projects/my-projects/', {
    method: 'GET',
  });
  return data.projects || [];
}

/**
 * Get a specific project by ID
 */
export async function getProjectById(projectId: number) {
  const data = await fetchWithAuth(`/projects/${projectId}/`, {
    method: 'GET',
  });
  return data.project;
}

/**
 * Get current user profile (including role)
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    // We treat this one differently as 404/500 shouldn't necessarily throw global UI errors
    // but rather return null for fallback logic
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/projects/user/profile/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Get all projects (Admin only)
 */
export async function getAllProjects(): Promise<ProjectRequest[]> {
  const data = await fetchWithAuth('/projects/all/', {
    method: 'GET',
  });
  return data.projects || data;
}

/**
 * Update project status (Admin only)
 */
export async function updateProjectStatus(projectId: number, status: string) {
  return await fetchWithAuth(`/projects/${projectId}/update-status/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Health check - no authentication required
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/projects/health/`);
  return await response.json();
}
