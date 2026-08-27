export type ComplaintStatus =
  | "Submitted"
  | "Under Review"
  | "Accepted"
  | "University Assigned"
  | "In Progress"
  | "Field Testing"
  | "Resolved"
  | "Rejected";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type Category =
  | "Water Management"
  | "Roads & Infrastructure"
  | "Electricity"
  | "Sanitation"
  | "Healthcare"
  | "Education"
  | "Public Safety"
  | "Environment";

export interface GeoLocation {
  district: string;
  block: string;
  villageOrTown: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface EvidenceFile {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  sizeLabel: string;
  url?: string;
  uploadProgress: number; // 0-100
}

export interface AIAnalysis {
  category: Category;
  subcategory: string;
  priority: Priority;
  affectedPopulationEstimate: number;
  keywords: string[];
  similarReports: SimilarReport[];
}

export interface SimilarReport {
  id: string;
  title: string;
  similarity: number; // 0-100
  relatedReportCount: number;
}

export interface TimelineStep {
  stage:
    | "Submitted"
    | "AI Screening"
    | "Government Validation"
    | "University Assigned"
    | "Solution Development"
    | "Field Testing"
    | "Completed";
  status: "completed" | "current" | "upcoming";
  date?: string;
  stakeholder?: string;
  description?: string;
}

export interface Complaint {
  id: string; // e.g. JH-WTR-2026-001842
  title: string;
  description: string;
  category: Category;
  subcategory: string;
  urgency: Priority;
  affectedPopulation: number;
  status: ComplaintStatus;
  priority: Priority;
  location: GeoLocation;
  evidence: EvidenceFile[];
  aiAnalysis: AIAnalysis;
  timeline: TimelineStep[];
  createdAt: string;
  updatedAt: string;
  supportCount: number;
  feedbackSubmitted?: boolean;
}

export interface NearbyProblem {
  id: string;
  title: string;
  category: Category;
  location: string;
  supportCount: number;
  status: ComplaintStatus;
  hasSupported: boolean;
}

export type NotificationType =
  | "Complaint Accepted"
  | "University/Expert Assigned"
  | "Complaint In Progress"
  | "Solution Ready"
  | "Complaint Completed"
  | "Feedback Requested";

export interface AppNotification {
  id: string;
  type: NotificationType;
  complaintId: string;
  complaintTitle: string;
  message: string;
  smsMessage: string;
  timestamp: string;
  read: boolean;
}

export interface FeedbackEntry {
  id: string;
  complaintId: string;
  complaintTitle: string;
  resolution: "Completely" | "Partially" | "Not resolved";
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface CitizenProfile {
  name: string;
  phone: string;
  email: string;
  location: string;
  joinedDate: string;
  stats: {
    submitted: number;
    resolved: number;
    inProgress: number;
    supportGiven: number;
  };
  preferences: {
    smsEnabled: boolean;
    inAppEnabled: boolean;
  };
}
