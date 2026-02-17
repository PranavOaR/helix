/**
 * Helix Backend API Integration — Phase 2
 * 
 * All API calls to the Django backend.
 * Updated to use the new /requests/ and /admin/requests/ endpoints.
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
  title: string;
  description: string;
  status: "PENDING" | "REVIEWING" | "IN_PROGRESS" | "COMPLETED" | "DELIVERED" | "CLOSED" | "REJECTED" | "CANCELLED";
  status_display: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  priority_display: string;
  user_email: string;
  assigned_to: number | null;
  assigned_to_email: string | null;
  is_terminal: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface RequestActivity {
  id: number;
  action: string;
  action_display: string;
  detail: string;
  performed_by: number;
  performed_by_email: string;
  timestamp: string;
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
      const text = await response.text();
      if (text.includes('auth') || text.includes('token')) {
        console.warn("Unauthorized (401) - Logging out");
        const auth = getAuth();
        await signOut(auth);
        window.location.href = '/';
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
    if (error.message && !error.message.includes('Session expired')) {
      console.error(`API Request Failed: ${endpoint}`, error);
    }
    throw error;
  }
}

// --- Public APIs ---

/**
 * Get available services (Mock — no backend endpoint)
 */
export async function getServices(): Promise<Service[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
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
 * Create a new request
 */
export async function createProject(
  title: string,
  description: string,
  priority: string = "MEDIUM"
) {
  return await fetchWithAuth('/requests/', {
    method: 'POST',
    body: JSON.stringify({ title, description, priority }),
  });
}

/**
 * Get all requests for the authenticated user
 */
export async function getMyProjects(): Promise<ProjectRequest[]> {
  const data = await fetchWithAuth('/requests/', {
    method: 'GET',
  });
  // DRF pagination returns { count, next, previous, results }
  return data.results || data;
}

/**
 * Get current user profile (including role)
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const data = await fetchWithAuth('/auth/me/', { method: 'GET' });
    return {
      id: data.uid,
      email: data.email,
      role: data.role as "USER" | "ADMIN"
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get all requests (Admin only)
 */
export async function getAllProjects(): Promise<ProjectRequest[]> {
  const data = await fetchWithAuth('/admin/requests/', {
    method: 'GET',
  });
  // DRF pagination returns { count, next, previous, results }
  return data.results || data;
}

/**
 * Update request status and/or priority (Admin only)
 */
export async function updateProjectStatus(requestId: number, status?: string, priority?: string) {
  const body: Record<string, string> = {};
  if (status) body.status = status;
  if (priority) body.priority = priority;

  return await fetchWithAuth(`/admin/requests/${requestId}/`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * Assign request to admin user (Admin only)
 */
export async function assignRequest(requestId: number, assignedTo: number | null) {
  return await fetchWithAuth(`/admin/requests/${requestId}/assign/`, {
    method: 'POST',
    body: JSON.stringify({ assigned_to: assignedTo }),
  });
}

/**
 * Get activity log for a request (Admin)
 */
export async function getRequestActivities(requestId: number): Promise<RequestActivity[]> {
  const data = await fetchWithAuth(`/admin/requests/${requestId}/activities/`, {
    method: 'GET',
  });
  return data.results || data;
}

/**
 * Get activity log for own request (User)
 */
export async function getMyRequestActivities(requestId: number): Promise<RequestActivity[]> {
  const data = await fetchWithAuth(`/requests/${requestId}/activities/`, {
    method: 'GET',
  });
  return data.results || data;
}
