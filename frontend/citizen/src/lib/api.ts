import type { Complaint, ComplaintStatus, Priority, Category } from "../types";

const API_BASE = '/api';

export interface ProblemSubmission {
  name: string;
  email: string;
  role: string;
  organization?: string | null;
  title: string;
  description: string;
  domain: string;
  latitude: number;
  longitude: number;
}

export interface AIAnalysisResponse {
  analysis: {
    summary: string;
    domain: string;
    severity: string;
    affected_people: string | number;
    keywords: string[];
    required_expertise: string[];
  };
  message: string;
  problem_id: number;
}

export interface Match {
  id: number;
  name: string;
  department: string;
  designation: string;
  expertise: string;
  university_name: string;
  similarity: number;
}

export interface UniversityMatch {
  id: number;
  name: string;
  description: string;
  location: string;
  similarity: number;
}

export interface ParseResult {
  type: string;
  filename: string;
  text: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  joinedDate?: string;
  stats?: {
    submitted: number;
    resolved: number;
    inProgress: number;
    supportGiven: number;
  };
}

function normalizePriority(value: unknown): Priority {
  const priority = String(value || '').toLowerCase();
  if (priority === 'low') return 'Low';
  if (priority === 'high') return 'High';
  if (priority === 'critical') return 'Critical';
  return 'Medium';
}

// Map backend problem to frontend Complaint type
function mapBackendProblem(p: any): Complaint {
  return {
    id: `JH-SAATHI-${p.id}`,
    title: p.title,
    description: p.description,
    category: (p.domain || "Environment") as Category,
    subcategory: p.ai_keywords ? p.ai_keywords[0] : "General",
    urgency: normalizePriority(p.severity),
    affectedPopulation: parseInt(p.affected_people) || 0,
    status: (p.status || "Under Review") as ComplaintStatus,
    priority: normalizePriority(p.severity),
    location: {
      district: "Jharkhand",
      block: "",
      villageOrTown: "Local Area",
      address: "Location coordinates provided",
      latitude: p.latitude,
      longitude: p.longitude,
    },
    evidence: [],
    aiAnalysis: {
      category: (p.domain || "Environment") as Category,
      subcategory: "General",
      priority: normalizePriority(p.severity),
      affectedPopulationEstimate: parseInt(p.affected_people) || 0,
      keywords: p.ai_keywords || [],
      similarReports: [],
    },
    timeline: p.timeline || [
      {
        stage: "Submitted",
        status: "completed",
        date: p.created_at,
        stakeholder: "Citizen",
        description: "Problem reported via SAATHI platform.",
      },
      {
        stage: "AI Screening",
        status: p.ai_summary ? "completed" : "current",
        date: p.updated_at || p.created_at,
        stakeholder: "SAATHI AI",
        description: p.ai_summary || "AI analysis in progress.",
      }
    ],
    createdAt: p.created_at,
    updatedAt: p.updated_at || p.created_at,
    supportCount: p.supportCount || 0,
  };
}

// Helper for fetch with credentials and standardized error handling
async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
        ...options,
        credentials: 'include', // Vital for Flask sessions/cookies
    });

    if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
        } catch (e) {
            // Not JSON or no error field
        }
        
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        throw error;
    }
    return response;
}

export const api = {
  async register(data: any): Promise<User> {
    const response = await fetchWithAuth(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(data: any): Promise<User> {
    const response = await fetchWithAuth(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async logout() {
    try {
      await fetchWithAuth(`${API_BASE}/logout`, { method: 'POST' });
    } catch (e) {
      // Ignore logout errors
    }
  },

  async getMe(): Promise<User | null> {
    try {
      const response = await fetchWithAuth(`${API_BASE}/me`);
      return response.json();
    } catch (err: any) {
      if (err.status === 401) return null;
      throw err;
    }
  },

  async submitProblem(data: ProblemSubmission) {
    const response = await fetchWithAuth(`${API_BASE}/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async analyzeProblem(problemId: number): Promise<AIAnalysisResponse> {
    const response = await fetchWithAuth(`${API_BASE}/problems/${problemId}/analyze`, {
      method: 'POST',
    });
    return response.json();
  },

  async updateProblemPriority(problemId: number, priority: Priority) {
    const response = await fetchWithAuth(`${API_BASE}/problems/${problemId}/priority`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority }),
    });
    return response.json();
  },

  async getProblems(myComplaints: boolean = false): Promise<Complaint[]> {
    const url = myComplaints ? `${API_BASE}/problems?my_complaints=true` : `${API_BASE}/problems`;
    const response = await fetchWithAuth(url);
    const data = await response.json();
    return (data.problems || []).map(mapBackendProblem);
  },

  async getProblem(id: string): Promise<Complaint> {
    const numericId = id.split('-').pop();
    const response = await fetchWithAuth(`${API_BASE}/problems/${numericId}`);
    const data = await response.json();
    return mapBackendProblem(data);
  },

  async getMatches(problemId: string): Promise<Match[]> {
    const numericId = problemId.split('-').pop();
    try {
      const response = await fetchWithAuth(`${API_BASE}/problems/${numericId}/matches`);
      const data = await response.json();
      return data.matches || [];
    } catch (e) {
      return [];
    }
  },

  async getUniversityMatches(problemId: string): Promise<UniversityMatch[]> {
    const numericId = problemId.split('-').pop();
    try {
      const response = await fetchWithAuth(`${API_BASE}/problems/${numericId}/universities`);
      const data = await response.json();
      return data.universities || [];
    } catch (e) {
      return [];
    }
  },

  async parseInput(file: File | Blob, filename: string = 'file'): Promise<ParseResult> {
    const formData = new FormData();
    formData.append('file', file, filename);

    const response = await fetchWithAuth(`${API_BASE}/parse-input`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async getNearbyProblems(lat: number, lng: number): Promise<Complaint[]> {
    try {
      const response = await fetchWithAuth(`${API_BASE}/problems/nearby?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      return (data || []).map(mapBackendProblem);
    } catch (e) {
      return [];
    }
  },

  async supportProblem(problemId: string) {
    const numericId = problemId.split('-').pop();
    const response = await fetchWithAuth(`${API_BASE}/problems/${numericId}/support`, {
      method: 'POST'
    });
    return response.json();
  },

  async getNotifications(): Promise<any[]> {
    try {
      const response = await fetchWithAuth(`${API_BASE}/notifications`);
      return response.json();
    } catch (e) {
      return [];
    }
  },

  async markNotificationRead(id: number) {
    await fetchWithAuth(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
  },

  async submitFeedback(data: any) {
    const response = await fetchWithAuth(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getFeedback(): Promise<any[]> {
    const response = await fetchWithAuth(`${API_BASE}/feedback`);
    if (!response.ok) return [];
    return response.json();
  },

  async updateProfile(data: { name?: string; phone?: string; location?: string }) {
    const response = await fetchWithAuth(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }
};
