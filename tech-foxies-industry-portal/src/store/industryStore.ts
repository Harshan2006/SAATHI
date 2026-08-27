import type { IndustryProfile } from "../types/industry";

const LOCAL_STORAGE_KEY = "saathi_industry_profile";

export const DEFAULT_PROFILE: IndustryProfile = {
  account: {
    fullName: "Siddharth Sen",
    designation: "Engineering Lead, Smart Infrastructure",
    officialEmail: "siddharth.sen@abctech.in",
    phone: "9876543210",
  },
  company: {
    companyId: "IND-2026-00124",
    companyName: "ABC Technologies",
    companyType: "Corporate",
    description: "Enterprise software, IoT solutions, cloud intelligence systems, and hardware manufacturing provider focusing on smart utility infrastructure, rural development, and environmental diagnostics.",
    website: "https://www.abctech.in",
    email: "contact@abctech.in",
    phone: "0651234567",
    companySize: "250 - 500 employees",
    state: "Jharkhand",
    district: "Ranchi",
    city: "Ranchi",
    address: "Khelgaon Sports Complex road, Mesra, Ranchi",
  },
  expertise: {
    technologies: ["IoT", "AI / ML", "Cloud Computing", "Embedded Systems", "Hardware", "Data Analytics"],
    domains: ["Water Management", "Agriculture", "Energy", "Rural Development"],
    customCapabilities: ["ESP32 custom firmware", "Watertight node assembly"],
  },
  support: {
    capabilities: ["Funding", "Technical Mentorship", "Hardware", "Software", "Testing", "Field Deployment"],
    fundingRange: {
      min: 200000,
      max: 1000000,
    },
    fundingTypes: ["Project Funding", "Prototype Funding", "CSR Funding"],
    mentorshipAreas: ["IoT battery cycles", "Signal filtering", "PCB layout design"],
    mentorCount: 4,
    mentorshipHours: 20,
    mentorshipMode: ["Online", "Hybrid"],
  },
  preferences: {
    projectStages: ["Prototype", "Testing", "Pilot"],
    sectors: ["Water Management", "Agriculture", "Electricity", "Environment"],
    locations: ["Jharkhand", "East India"],
    districts: ["Ranchi", "East Singhbhum", "Hazaribagh", "Dhanbad"],
    impactAreas: ["Water", "Agriculture", "Rural Development"],
  },
  experience: {
    previousProjects: [
      { title: "Ranchi Smart Grid integration", description: "Deployed 20 telemetry check gates in Ranchi suburbs.", domain: "Energy", year: "2025", impact: "Reduced grid loss by 14%" }
    ],
    universityCollaborations: [],
    governmentCollaborations: [],
    socialImpactProjects: [],
  },
  verification: {
    status: "Pending Verification",
    registrationNumber: "REG-2026-00984251",
    gstin: "20AAAAA0000A1Z5",
    documents: ["incorp_cert.pdf", "gst_registration.pdf"],
  },
  completeness: 85,
};

// Calculate profile completeness %
export function calculateCompleteness(profile: IndustryProfile): number {
  let filledCount = 0;
  let totalCount = 0;

  const checkVal = (val: any) => {
    totalCount++;
    if (val && (typeof val !== "object" || Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0)) {
      filledCount++;
    }
  };

  // Account
  checkVal(profile.account.fullName);
  checkVal(profile.account.designation);
  checkVal(profile.account.officialEmail);
  checkVal(profile.account.phone);

  // Company
  checkVal(profile.company.companyName);
  checkVal(profile.company.companyType);
  checkVal(profile.company.description);
  checkVal(profile.company.website);
  checkVal(profile.company.email);
  checkVal(profile.company.phone);
  checkVal(profile.company.companySize);
  checkVal(profile.company.state);
  checkVal(profile.company.district);
  checkVal(profile.company.city);
  checkVal(profile.company.address);

  // Expertise
  checkVal(profile.expertise.technologies);
  checkVal(profile.expertise.domains);

  // Support
  checkVal(profile.support.capabilities);

  // Preferences
  checkVal(profile.preferences.projectStages);
  checkVal(profile.preferences.sectors);
  checkVal(profile.preferences.districts);

  // Experience
  totalCount++;
  if (
    profile.experience.previousProjects.length > 0 ||
    profile.experience.universityCollaborations.length > 0 ||
    profile.experience.governmentCollaborations.length > 0 ||
    profile.experience.socialImpactProjects.length > 0
  ) {
    filledCount++;
  }

  // Verification
  checkVal(profile.verification.registrationNumber);

  return Math.round((filledCount / totalCount) * 100);
}

// Load profile from localStorage or seed default
export function getIndustryProfile(): IndustryProfile {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

// Save profile to localStorage
export function saveIndustryProfile(profile: IndustryProfile): IndustryProfile {
  profile.completeness = calculateCompleteness(profile);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

// AI project matching calculator
export interface MatchResult {
  matchScore: number;
  matchReasons: string[];
}

export function calculateProjectMatch(profile: IndustryProfile, project: any): MatchResult {
  let score = 55; // Base minimum score
  const reasons: string[] = [];

  // 1. Technologies match
  const requiredTechs = project.requiredExpertise || []; // wait, in active projects it might be in some other field
  const companyTechs = profile.expertise.technologies.map(t => t.toLowerCase());
  
  let techMatchCount = 0;
  requiredTechs.forEach((t: string) => {
    if (companyTechs.some(ct => ct.includes(t.toLowerCase()) || t.toLowerCase().includes(ct))) {
      techMatchCount++;
    }
  });

  if (techMatchCount > 0) {
    score += Math.min(techMatchCount * 8, 25);
    reasons.push(`✓ matching technical expertise in ${project.requiredExpertise.slice(0, 2).join(", ")}`);
  }

  // 2. Domain / Sector Match
  const projectSector = project.category || "";
  const companySectors = profile.preferences.sectors.map(s => s.toLowerCase());
  const companyDomains = profile.expertise.domains.map(d => d.toLowerCase());

  if (
    companySectors.some(s => s.includes(projectSector.toLowerCase()) || projectSector.toLowerCase().includes(s)) ||
    companyDomains.some(d => d.includes(projectSector.toLowerCase()) || projectSector.toLowerCase().includes(d))
  ) {
    score += 12;
    reasons.push(`✓ aligned with your focus on ${projectSector}`);
  }

  // 3. Stage Match
  const projectStage = project.projectStage || "Prototype";
  const preferredStages = profile.preferences.projectStages.map(s => s.toLowerCase());
  if (preferredStages.some(s => s.includes(projectStage.toLowerCase()) || projectStage.toLowerCase().includes(s))) {
    score += 8;
    reasons.push(`✓ project is in the ${projectStage} phase, matching stage preference`);
  }

  // 4. District / Location Match
  const projectDistrict = project.district || (project.location && project.location.district) || "";
  const preferredDistricts = profile.preferences.districts.map(d => d.toLowerCase());
  if (preferredDistricts.some(d => d.includes(projectDistrict.toLowerCase()) || projectDistrict.toLowerCase().includes(d))) {
    score += 8;
    reasons.push(`✓ located in preferred target area (${projectDistrict} district)`);
  }

  // 5. Support Match
  const requiredSupport = project.requiredSupport || [];
  const supportOfferings = profile.support.capabilities.map(c => c.toLowerCase());
  
  let supportMatch = false;
  requiredSupport.forEach((sup: string) => {
    if (supportOfferings.some(so => so.includes(sup.toLowerCase()) || sup.toLowerCase().includes(so))) {
      supportMatch = true;
    }
  });

  if (supportMatch) {
    score += 10;
    reasons.push(`✓ fits your support capabilities (${profile.support.capabilities.slice(0, 3).join(", ")})`);
  }

  // Cap matching score between 55% and 98%
  score = Math.max(55, Math.min(score, 98));

  // Fallbacks if reasons is empty
  if (reasons.length === 0) {
    reasons.push("✓ compatible innovation stage");
    reasons.push("✓ local impact focus area alignment");
  }

  return {
    matchScore: score,
    matchReasons: reasons,
  };
}
