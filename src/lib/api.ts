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
      console.warn("Unauthorized (401) - Logging out");
      const auth = getAuth();
      await signOut(auth);
      window.location.href = '/'; // Hard redirect to login
      throw new Error("Session expired. Please login again.");
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
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
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
    const response = await fetch(`${API_BASE_URL}/users/me/`, {
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
  return await fetchWithAuth(`/projects/${projectId}/update_status/`, {
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
