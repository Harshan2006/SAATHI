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

// Map backend problem to frontend Complaint type
function mapBackendProblem(p: any): Complaint {
  return {
    id: `JH-SAATHI-${p.id}`,
    title: p.title,
    description: p.description,
    category: (p.domain || "Environment") as Category,
    subcategory: p.ai_keywords ? p.ai_keywords[0] : "General",
    urgency: (p.severity || "Medium") as Priority,
    affectedPopulation: parseInt(p.affected_people) || 0,
    status: (p.status || "Under Review") as ComplaintStatus,
    priority: (p.severity || "Medium") as Priority,
    location: {
      district: "Jharkhand",
      block: "",
      villageOrTown: "",
      address: "Location coordinates provided",
      latitude: p.latitude,
      longitude: p.longitude,
    },
    evidence: [],
    aiAnalysis: {
      category: (p.domain || "Environment") as Category,
      subcategory: "General",
      priority: (p.severity || "Medium") as Priority,
      affectedPopulationEstimate: parseInt(p.affected_people) || 0,
      keywords: p.ai_keywords || [],
      similarReports: [],
    },
    timeline: [
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
        date: p.updated_at,
        stakeholder: "SAATHI AI",
        description: p.ai_summary || "AI analysis in progress.",
      }
    ],
    createdAt: p.created_at,
    updatedAt: p.updated_at || p.created_at,
    supportCount: 0,
  };
}

export const api = {
  async submitProblem(data: ProblemSubmission) {
    const response = await fetch(`${API_BASE}/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit problem');
    return response.json();
  },

  async analyzeProblem(problemId: number): Promise<AIAnalysisResponse> {
    const response = await fetch(`${API_BASE}/problems/${problemId}/analyze`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to analyze problem');
    return response.json();
  },

  async getProblems(): Promise<Complaint[]> {
    const response = await fetch(`${API_BASE}/problems`);
    if (!response.ok) throw new Error('Failed to fetch problems');
    const data = await response.json();
    return (data.problems || []).map(mapBackendProblem);
  },

  async getProblem(id: string): Promise<Complaint> {
    const numericId = id.split('-').pop();
    const response = await fetch(`${API_BASE}/problems/${numericId}`);
    if (!response.ok) throw new Error('Failed to fetch problem detail');
    const data = await response.json();
    return mapBackendProblem(data);
  },

  async getMatches(problemId: string): Promise<Match[]> {
    const numericId = problemId.split('-').pop();
    const response = await fetch(`${API_BASE}/problems/${numericId}/matches`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.matches || [];
  },

  async getUniversityMatches(problemId: string): Promise<UniversityMatch[]> {
    const numericId = problemId.split('-').pop();
    const response = await fetch(`${API_BASE}/problems/${numericId}/universities`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.universities || [];
  }
};
