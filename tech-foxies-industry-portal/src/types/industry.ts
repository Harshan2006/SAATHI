export interface IndustryAccount {
  fullName: string;
  designation: string;
  officialEmail: string;
  phone: string;
}

export interface IndustryCompany {
  companyId: string;
  companyName: string;
  companyType: "Startup" | "MSME" | "Corporate" | "CSR Organization" | "Research Organization" | "Innovation Hub" | "Other";
  description: string;
  website: string;
  email: string;
  phone: string;
  companySize: string;
  state: string;
  district: string;
  city: string;
  address: string;
}

export interface IndustryCapabilities {
  technologies: string[];
  domains: string[];
  customCapabilities: string[];
}

export interface IndustrySupport {
  capabilities: string[];
  fundingRange?: {
    min: number;
    max: number;
  };
  fundingTypes: string[]; // CSR Funding, Project Funding, etc.
  mentorshipAreas: string[];
  mentorCount?: number;
  mentorshipHours?: number;
  mentorshipMode: string[]; // Online, On-site, Hybrid
}

export interface IndustryPreferences {
  projectStages: string[];
  sectors: string[];
  locations: string[]; // Jharkhand, East India, Pan India
  districts: string[];
  impactAreas: string[];
}

export interface ExperienceRecord {
  title: string;
  description: string;
  domain: string;
  year: string;
  impact: string;
}

export interface IndustryExperience {
  previousProjects: ExperienceRecord[];
  universityCollaborations: ExperienceRecord[];
  governmentCollaborations: ExperienceRecord[];
  socialImpactProjects: ExperienceRecord[];
}

export interface IndustryVerification {
  status: "Pending Verification" | "Verified" | "Rejected";
  registrationNumber: string;
  gstin?: string;
  documents: string[];
}

export interface IndustryProfile {
  account: IndustryAccount;
  company: IndustryCompany;
  expertise: IndustryCapabilities;
  support: IndustrySupport;
  preferences: IndustryPreferences;
  experience: IndustryExperience;
  verification: IndustryVerification;
  completeness: number;
}

export interface ProjectEvidence {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  sizeLabel: string;
}

export interface ProjectFacultyMentor {
  name: string;
  role: string;
  email: string;
  expertise: string[];
}

export interface ProjectStudentTeamMember {
  name: string;
  role: string;
  skills: string[];
}

export interface Project {
  id: string; // e.g. JH-WTR-2026-001842
  title: string;
  description: string;
  category: string;
  subcategory: string;
  urgency: string;
  affectedPopulation: number;
  status: string;
  priority: string;
  location: {
    district: string;
    block: string;
    villageOrTown: string;
    address: string;
  };
  evidence: ProjectEvidence[];
  createdAt: string;
  updatedAt: string;
  
  // University details
  universityName: string;
  department: string;
  facultyMentor: ProjectFacultyMentor;
  studentTeam: ProjectStudentTeamMember[];
  projectStage: "Research" | "Prototype" | "Testing" | "Pilot" | "Deployment" | "Completed";
  progress: number;
  
  // Industry specific requirements
  requiredSupport: string[];
  expectedImpact: string;
}

export interface IndustryMatch {
  matchScore: number;
  matchReasons: string[];
}
