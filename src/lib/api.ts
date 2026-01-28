/**
 * Helix Backend API Integration
 * 
 * This file contains all API calls to the Django backend.
 * Make sure Django server is running on http://localhost:8000
 */

import { getAuth } from 'firebase/auth';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Get Firebase ID token from current user
 */
async function getAuthToken(): Promise<string> {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return await user.getIdToken();
}

/**
 * Create a new project request
 */
export async function createProject(
  serviceType: 'website' | 'uiux' | 'branding' | 'app' | 'canva',
  requirementsText: string
) {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/projects/create/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_type: serviceType,
        requirements_text: requirementsText,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create project');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Get all projects for the authenticated user
 */
export async function getMyProjects() {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/projects/my-projects/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch projects');
    }
    
    return data.projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Get a specific project by ID
 */
export async function getProjectById(projectId: number) {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch project');
    }
    
    return data.project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

/**
 * Health check - no authentication required
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/health/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
}
