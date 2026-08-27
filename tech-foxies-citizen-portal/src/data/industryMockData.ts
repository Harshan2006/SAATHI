import type { Category, Priority, GeoLocation, EvidenceFile, ComplaintStatus } from "../types";

export interface CompanyProfile {
  name: string;
  industry: string;
  description: string;
  location: string;
  website: string;
  size: string;
  capabilities: string[];
  sectors: string[];
  support: string[];
  preferences: {
    fundingRange: string;
    preferredSectors: string[];
    preferredDistricts: string[];
    preferredProjectStages: string[];
  };
  completeness: number;
}

export interface AvailableChallenge {
  id: string;
  title: string;
  problemSummary: string;
  district: string;
  category: Category;
  priority: Priority;
  affectedPopulation: number;
  dateValidated: string;
  requiredExpertise: string[];
  matchScore: number;
  evidence: EvidenceFile[];
}

export interface IndustryProject {
  id: string;
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
  createdAt: string;
  updatedAt: string;
  supportCount: number;
  
  // University details
  universityName: string;
  department: string;
  facultyMentor: {
    name: string;
    role: string;
    email: string;
    expertise: string[];
  };
  studentTeam: {
    name: string;
    role: string;
    skills: string[];
  }[];
  projectStage: "Research" | "Prototype" | "Testing" | "Pilot" | "Deployment" | "Completed";
  progress: number; // 0-100
  
  // Industry integration
  matchScore: number;
  matchReasons: string[];
  requiredSupport: string[];
  expectedImpact: string;
}

export interface CollaborationWorkspace {
  projectId: string;
  projectTitle: string;
  universityName: string;
  facultyMentor: string;
  studentTeamSize: number;
  companyRole: string;
  progress: number;
  currentStage: string;
  nextMilestone: string;
  tasks: {
    id: string;
    title: string;
    assignee: string;
    status: "Pending" | "In Progress" | "Completed";
    dueDate: string;
  }[];
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    status: "Upcoming" | "In Progress" | "Completed";
    completedDate?: string;
  }[];
  recentActivity: {
    id: string;
    description: string;
    user: string;
    timestamp: string;
    category: "system" | "funding" | "hardware" | "mentorship" | "document" | "testing" | "deployment";
  }[];
  messages: {
    id: string;
    senderName: string;
    senderRole: string;
    senderAvatar?: string;
    message: string;
    timestamp: string;
  }[];
  documents: {
    id: string;
    name: string;
    uploadedBy: string;
    uploadedAt: string;
    size: string;
  }[];
}

export const companyProfile: CompanyProfile = {
  name: "ABC Technologies",
  industry: "Information Technology & Hardware Engineering",
  description: "Enterprise software, IoT solutions, cloud intelligence systems, and hardware manufacturing provider focusing on smart utility infrastructure, rural development, and environmental diagnostics.",
  location: "Ranchi, Jharkhand",
  website: "https://www.abctech.in",
  size: "250 - 500 employees",
  capabilities: ["IoT", "AI/ML", "Cloud", "Embedded Systems", "Hardware", "Software", "Data Analytics"],
  sectors: ["Water", "Agriculture", "Energy", "Infrastructure", "Rural Development"],
  support: ["Funding", "Mentorship", "Hardware", "Software", "Testing", "Deployment"],
  preferences: {
    fundingRange: "₹2,00,000 - ₹10,00,000 per project",
    preferredSectors: ["Water Management", "Roads & Infrastructure", "Electricity", "Environment"],
    preferredDistricts: ["Ranchi", "East Singhbhum", "Hazaribagh", "Dhanbad"],
    preferredProjectStages: ["Prototype", "Testing", "Pilot"],
  },
  completeness: 85,
};

export const availableChallenges: AvailableChallenge[] = [
  {
    id: "JH-CH-WTR-2026-04",
    title: "Groundwater depletion in Ormanjhi tribal belt",
    problemSummary: "Rapid drying of community wells impacting irrigation water and domestic supply for over 15 villages. The water table has fallen below 200 feet, and urgent geophysical mapping and small check dams/recharge structures are required.",
    district: "Ranchi",
    category: "Water Management",
    priority: "Critical",
    affectedPopulation: 4200,
    dateValidated: "2026-04-15",
    requiredExpertise: ["Geological Mapping", "Civil Engineering", "Water Management"],
    matchScore: 92,
    evidence: [{ id: "ev-ch1", name: "dry_well.jpg", type: "image", sizeLabel: "1.4 MB", uploadProgress: 100 }],
  },
  {
    id: "JH-CH-RDS-2026-09",
    title: "Unmarked dangerous curves on Ranchi-Patratu valley road",
    problemSummary: "Recurring accidents during night and misty winter weather due to missing reflectors, proper guardrails, and warning lights at three critical hairpins.",
    district: "Ranchi",
    category: "Roads & Infrastructure",
    priority: "High",
    affectedPopulation: 10000,
    dateValidated: "2026-04-18",
    requiredExpertise: ["Traffic Systems", "Reflective Materials", "Civil Engineering"],
    matchScore: 78,
    evidence: [{ id: "ev-ch2", name: "curve_misty.jpg", type: "image", sizeLabel: "2.8 MB", uploadProgress: 100 }],
  },
  {
    id: "JH-CH-SAN-2026-11",
    title: "Coal dust pollution monitoring in Jharia market area",
    problemSummary: "Heavy particulate matter deposit in open marketplace due to mining transport vehicles, leading to respiratory disorders. Requires real-time dust levels monitoring system and dust suppression automation.",
    district: "Dhanbad",
    category: "Sanitation",
    priority: "Critical",
    affectedPopulation: 12000,
    dateValidated: "2026-04-20",
    requiredExpertise: ["IoT Sensor Network", "Data Dashboards", "Dust Suppression Systems"],
    matchScore: 95,
    evidence: [{ id: "ev-ch3", name: "coal_dust.jpg", type: "image", sizeLabel: "2.1 MB", uploadProgress: 100 }],
  },
  {
    id: "JH-CH-ELC-2026-05",
    title: "Frequent microgrid trippings in rural Latehar village",
    problemSummary: "Solar microgrid installed in late 2024 experiences continuous tripping due to unbalanced domestic load and illegal hooking. Needs a smart load limiting device at the distribution box.",
    district: "Palamu",
    category: "Electricity",
    priority: "Medium",
    affectedPopulation: 850,
    dateValidated: "2026-04-10",
    requiredExpertise: ["Power Electronics", "Smart Grid meters", "Embedded firmware"],
    matchScore: 88,
    evidence: [{ id: "ev-ch4", name: "distribution_box.jpg", type: "image", sizeLabel: "1.7 MB", uploadProgress: 100 }],
  },
];

export const industryProjects: IndustryProject[] = [
  {
    id: "JH-WTR-2026-001842",
    title: "Smart Water Monitoring System",
    description: "Developing IoT-based groundwater recharge monitors and automated distribution control systems. University team is designing recharge pits equipped with flow sensors and depth meters to ensure equalized distribution and map aquifer rejuvenation.",
    category: "Water Management",
    subcategory: "Drinking Water",
    urgency: "High",
    affectedPopulation: 1200,
    status: "In Progress",
    priority: "High",
    location: {
      district: "Ranchi",
      block: "Kanke",
      villageOrTown: "Kanke Road",
      address: "Near Govt. Middle School, Kanke Road, Ranchi",
      latitude: 23.4239,
      longitude: 85.331,
    },
    evidence: [
      { id: "ev1", name: "borewell_dry.jpg", type: "image", sizeLabel: "2.1 MB", uploadProgress: 100 },
      { id: "ev2", name: "recharge_pit_draft.pdf", type: "document", sizeLabel: "4.5 MB", uploadProgress: 100 },
    ],
    createdAt: "2026-03-18T09:12:00+05:30",
    updatedAt: "2026-04-02T10:00:00+05:30",
    supportCount: 34,
    
    universityName: "BIT Mesra",
    department: "Civil & Environmental Engineering",
    facultyMentor: {
      name: "Dr. Alok Vardhan",
      role: "Professor & Head of Water Resources Dept.",
      email: "alok.vardhan@bitmesra.ac.in",
      expertise: ["Hydrology", "GIS Mapping", "Groundwater Recharge Systems"],
    },
    studentTeam: [
      { name: "Rahul Kumar", role: "Team Lead & IoT firmware", skills: ["Embedded C", "NodeMCU", "Water Sensors"] },
      { name: "Ananya Sen", role: "GIS Analyst & Design", skills: ["QGIS", "Civil CAD", "Hydrologic modeling"] },
      { name: "Amit Mahato", role: "Frontend developer", skills: ["React", "Tailwind CSS", "Data viz"] },
    ],
    projectStage: "Prototype",
    progress: 65,
    
    matchScore: 94,
    matchReasons: [
      "Fits IoT capability (Flow sensors, Depth telemetry)",
      "Matches Water Management sector preferences",
      "Ranchi district matches geographical preferences",
      "Opportunity for hardware prototyping support",
    ],
    requiredSupport: ["IoT Hardware", "Funding", "Field Testing", "Deployment"],
    expectedImpact: "Recharging 3 major dry borewells to restore daily supply of 40,000 liters of drinking water to 200+ households.",
  },
  {
    id: "JH-RDS-2026-000934",
    title: "Durability Pavement Repair Systems",
    description: "Developing cost-effective cold-mix bitumen formulations with municipal plastic waste for rapid pothole repairs during monsoon seasons. The mixture sets quickly and reduces immediate stripping under heavy commercial truck axle load.",
    category: "Roads & Infrastructure",
    subcategory: "Road Damage",
    urgency: "Medium",
    affectedPopulation: 4500,
    status: "University Assigned",
    priority: "Medium",
    location: {
      district: "Ranchi",
      block: "Ranchi Sadar",
      villageOrTown: "Bariatu",
      address: "Bariatu Main Road, near Sabzi Mandi Junction",
      latitude: 23.3897,
      longitude: 85.3311,
    },
    evidence: [{ id: "ev4", name: "pothole_1.jpg", type: "image", sizeLabel: "2.4 MB", uploadProgress: 100 }],
    createdAt: "2026-02-05T08:30:00+05:30",
    updatedAt: "2026-02-14T09:45:00+05:30",
    supportCount: 61,
    
    universityName: "NIT Jamshedpur",
    department: "Civil & Materials Engineering",
    facultyMentor: {
      name: "Dr. Preeti Sinha",
      role: "Associate Professor, Highway Research Lab",
      email: "psinha.civ@nitjsr.ac.in",
      expertise: ["Pavement Design", "Modified Bitumen", "Materials Testing"],
    },
    studentTeam: [
      { name: "Vikram Aditya", role: "Chemical formulator", skills: ["Materials testing", "Polymer Chemistry"] },
      { name: "Suman Kumari", role: "Field implementation supervisor", skills: ["Site Survey", "Traffic Analysis"] },
    ],
    projectStage: "Research",
    progress: 35,
    
    matchScore: 72,
    matchReasons: [
      "Matches Infrastructure sector interest",
      "Ranchi district matches geographical preferences",
      "Testing capability can help validate cold-mix test cubes",
    ],
    requiredSupport: ["Testing Facilities", "Chemical Ingredients Funding", "Deployment Support"],
    expectedImpact: "Eradicate severe water accumulation and accident-prone zones over a 300m commercial market stretch, benefiting 4,500 daily commuters.",
  },
  {
    id: "JH-HLT-2026-000148",
    title: "Rural Health Diagnostics Hub",
    description: "Designing a portable solar-powered diagnostic kit for remote primary health centers (PHC) lacking stable electricity. Kit integrates ECG, basic blood analyzer, and vital monitors into an IoT case connected to Ranchi District hospital via low-bandwidth GPRS.",
    category: "Healthcare",
    subcategory: "Staffing",
    urgency: "Critical",
    affectedPopulation: 6000,
    status: "Accepted",
    priority: "Critical",
    location: {
      district: "Palamu",
      block: "Ormanjhi",
      villageOrTown: "Ormanjhi",
      address: "Primary Health Centre, Ormanjhi",
      latitude: 23.5205,
      longitude: 85.3803,
    },
    evidence: [{ id: "ev8", name: "phc_notice.jpg", type: "image", sizeLabel: "1.2 MB", uploadProgress: 100 }],
    createdAt: "2026-04-20T12:00:00+05:30",
    updatedAt: "2026-04-21T09:00:00+05:30",
    supportCount: 112,
    
    universityName: "BIT Mesra",
    department: "Electronics & Communication Engineering",
    facultyMentor: {
      name: "Dr. S. K. Dutta",
      role: "Professor, Bio-Medical Instrumentation Lab",
      email: "skdutta@bitmesra.ac.in",
      expertise: ["Bio-Sensors", "Telemedicine Systems", "Low Power Electronics"],
    },
    studentTeam: [
      { name: "Riya Oraon", role: "Sensor circuit designer", skills: ["Analog Circuits", "PCB Design", "ECG Filters"] },
      { name: "Gopal Pathak", role: "Cloud & Database setup", skills: ["Firebase", "GPRS communications", "Python"] },
      { name: "Shubham Raj", role: "Firmware developer", skills: ["ESP32", "RTOS", "Sensor calibrations"] },
    ],
    projectStage: "Testing",
    progress: 80,
    
    matchScore: 96,
    matchReasons: [
      "Fits Embedded Systems and Cloud expertise",
      "Matches AI/ML & Healthcare sector needs",
      "Mentorship capability can assist in Low-bandwidth data protocols",
      "Opportunities for pilot deployment under CSR scheme",
    ],
    requiredSupport: ["Mentorship (GPRS compression)", "Hardware components supply", "Field Testing approval", "Pilot Funding"],
    expectedImpact: "Providing primary diagnostic checks and remote doctor consulting access to 6,000+ villagers, saving 40-minute commutes to Ranchi.",
  },
  {
    id: "JH-AGR-2026-000210",
    title: "AI-Driven Smart Irrigation Controllers",
    description: "Development of solar-powered soil moisture and weather forecasting based irrigation valves. Prevents water wastage in the agricultural farms of Hazaribagh by distributing only the required volume of water per crop stage.",
    category: "Environment",
    subcategory: "Water Bodies",
    urgency: "Medium",
    affectedPopulation: 2500,
    status: "Accepted",
    priority: "Medium",
    location: {
      district: "Hazaribagh",
      block: "Bishnugarh",
      villageOrTown: "Bishnugarh Farms",
      address: "Bishnugarh Block Agricultural Coop, Hazaribagh",
      latitude: 24.0205,
      longitude: 85.7303,
    },
    evidence: [{ id: "ev11", name: "dry_crop.jpg", type: "image", sizeLabel: "1.9 MB", uploadProgress: 100 }],
    createdAt: "2026-04-20T10:00:00+05:30",
    updatedAt: "2026-04-22T08:00:00+05:30",
    supportCount: 42,
    
    universityName: "Birsa Agricultural University",
    department: "Agricultural Engineering",
    facultyMentor: {
      name: "Dr. Rajesh Prasad",
      role: "Head of Farm Machinery & Power Dept.",
      email: "rprasad@bau.edu.in",
      expertise: ["Soil Hydrology", "Precision Farming", "Irrigation Automation"],
    },
    studentTeam: [
      { name: "Kunal Munda", role: "Valve Control & Solar system", skills: ["Solenoid Valves", "Solar charge regulators"] },
      { name: "Divya Kumari", role: "Agronomy algorithms developer", skills: ["Crop water needs modeling", "Python ML"] },
    ],
    projectStage: "Pilot",
    progress: 90,
    
    matchScore: 89,
    matchReasons: [
      "Fits Embedded Systems and IoT sensing capabilities",
      "Matches Agriculture and Environment focus areas",
      "Pilot-ready stage allows direct technology deployment support",
    ],
    requiredSupport: ["Funding for 15 Pilot farm valves", "Mentorship", "Industrial testing equipment"],
    expectedImpact: "Increase crop yield by 20% and reduce agricultural water consumption by 35% across 50 cooperating farmlands in Hazaribagh.",
  },
];

export const activeCollaborations: CollaborationWorkspace[] = [
  {
    projectId: "JH-WTR-2026-001842",
    projectTitle: "Smart Water Monitoring System",
    universityName: "BIT Mesra",
    facultyMentor: "Dr. Alok Vardhan",
    studentTeamSize: 3,
    companyRole: "Industrial Mentor & Hardware Sponsor",
    progress: 65,
    currentStage: "Prototype Stage",
    nextMilestone: "Milestone 3: Assemble field testing enclosure & test waterproof casing",
    tasks: [
      { id: "t1", title: "Deliver IoT Flow Sensors & Solenoids", assignee: "ABC Hardware Procurement", status: "Completed", dueDate: "2026-04-10" },
      { id: "t2", title: "Complete waterproofing enclosure CAD layout", assignee: "Ananya Sen (BIT)", status: "In Progress", dueDate: "2026-05-02" },
      { id: "t3", title: "Write firmware calibration algorithms for depth sensor", assignee: "Rahul Kumar (BIT)", status: "In Progress", dueDate: "2026-05-05" },
      { id: "t4", title: "Configure Cloud API keys & database endpoints", assignee: "Amit Mahato (BIT)", status: "Pending", dueDate: "2026-05-15" },
    ],
    milestones: [
      { id: "m1", title: "System Requirement Definition & Site Selection", dueDate: "2026-03-30", status: "Completed", completedDate: "2026-03-28" },
      { id: "m2", title: "Sensor Interfacing & Initial Breadboard Demo", dueDate: "2026-04-15", status: "Completed", completedDate: "2026-04-12" },
      { id: "m3", title: "Weatherproof Enclosure Assembly & Enclosure Test", dueDate: "2026-05-08", status: "In Progress" },
      { id: "m4", title: "Field installation & 15-day continuous pilot trial", dueDate: "2026-05-30", status: "Upcoming" },
    ],
    recentActivity: [
      { id: "act1", description: "ABC Technologies approved Milestone 2 deliverables.", user: "HR Executive, ABC Tech", timestamp: "2026-04-12T16:00:00+05:30", category: "funding" },
      { id: "act2", description: "Delivered 3 industrial flow sensors and 2 submersible water depth transmitters.", user: "Logistics Team, ABC Tech", timestamp: "2026-04-10T11:20:00+05:30", category: "hardware" },
      { id: "act3", description: "Dr. Alok Vardhan scheduled a technical mentorship session on deep well calibration.", user: "Dr. Alok Vardhan", timestamp: "2026-04-05T09:40:00+05:30", category: "mentorship" },
      { id: "act4", description: "Uploaded 'Aquifer recharge rate estimation' spreadsheet.", user: "Ananya Sen", timestamp: "2026-04-02T14:30:00+05:30", category: "document" },
    ],
    messages: [
      { id: "msg1", senderName: "Dr. Alok Vardhan", senderRole: "Faculty Mentor", message: "Hello team. We received the depth transmitters today. The student lead, Rahul, is starting to run the bench tests. We might need some advice on configuring the low-sleep telemetry intervals.", timestamp: "2026-04-10T14:35:00+05:30" },
      { id: "msg2", senderName: "Siddharth Sen", senderRole: "ABC Engineering Lead", message: "Hi Dr. Alok. Excellent. For the ESP32 low sleep configurations, we recommend disabling the onboard brownout detection temporarily during transmission spikes. I will send over our sample energy-management headers tomorrow.", timestamp: "2026-04-10T17:15:00+05:30" },
      { id: "msg3", senderName: "Rahul Kumar", senderRole: "Student Lead", message: "Thank you Siddharth sir! The sample header will save us a lot of debugging time. We are aiming to complete breadboard integration by Friday.", timestamp: "2026-04-11T10:10:00+05:30" },
    ],
    documents: [
      { id: "doc1", name: "Recharge_Pit_Civil_Dimensions.pdf", uploadedBy: "Ananya Sen", uploadedAt: "2026-03-29", size: "1.4 MB" },
      { id: "doc2", name: "IoT_Flow_Sensor_Datasheet.pdf", uploadedBy: "Siddharth Sen", uploadedAt: "2026-04-09", size: "780 KB" },
      { id: "doc3", name: "Groundwater_Depth_Calibration_Log.xlsx", uploadedBy: "Rahul Kumar", uploadedAt: "2026-04-20", size: "220 KB" },
    ],
  },
  {
    projectId: "JH-HLT-2026-000148",
    projectTitle: "Rural Health Diagnostics Hub",
    universityName: "BIT Mesra",
    facultyMentor: "Dr. S. K. Dutta",
    studentTeamSize: 3,
    companyRole: "Sponsor and Cloud Hosting Partner",
    progress: 80,
    currentStage: "Testing Stage",
    nextMilestone: "Milestone 4: Hospital data interface verification with low-bandwidth emulation",
    tasks: [
      { id: "t2_1", title: "Set up sandbox cloud server and DB clusters", assignee: "ABC Cloud Ops Team", status: "Completed", dueDate: "2026-04-15" },
      { id: "t2_2", title: "Complete PCB assembly & enclosure routing", assignee: "Riya Oraon (BIT)", status: "Completed", dueDate: "2026-04-22" },
      { id: "t2_3", title: "Stress test remote ECG telemetry under 50kbps cellular speed", assignee: "Gopal Pathak (BIT)", status: "In Progress", dueDate: "2026-05-02" },
    ],
    milestones: [
      { id: "m2_1", title: "Bio-Amplifier circuits validation & telemetry tests", dueDate: "2026-03-10", status: "Completed", completedDate: "2026-03-08" },
      { id: "m2_2", title: "Diagnostic kit casing assembly & battery tests", dueDate: "2026-04-05", status: "Completed", completedDate: "2026-04-03" },
      { id: "m2_3", title: "Low-bandwidth data compression testing", dueDate: "2026-05-01", status: "In Progress" },
      { id: "m2_4", title: "Staging deployment in Ormanjhi PHC (30 days)", dueDate: "2026-05-20", status: "Upcoming" },
    ],
    recentActivity: [
      { id: "act2_1", description: "ABC cloud sandbox database provisioning complete.", user: "Systems Architect, ABC Tech", timestamp: "2026-04-15T10:00:00+05:30", category: "document" },
      { id: "act2_2", description: "Dr. S.K. Dutta uploaded prototype laboratory test reports.", user: "Dr. S. K. Dutta", timestamp: "2026-04-12T12:00:00+05:30", category: "document" },
      { id: "act2_3", description: "Funding tranche 2 (₹1,50,000) disbursed for PCB ordering.", user: "Finance Division, ABC Tech", timestamp: "2026-04-08T15:30:00+05:30", category: "funding" },
    ],
    messages: [
      { id: "msg2_1", senderName: "Dr. S. K. Dutta", senderRole: "Faculty Mentor", message: "The database endpoints are communicating correctly. Riya has finished soldering the final diagnostic motherboard. We are beginning lab tests for temperature readings accuracy.", timestamp: "2026-04-18T11:40:00+05:30" },
    ],
    documents: [
      { id: "doc2_1", name: "Diagnostics_Kit_Schematics_v2.pdf", uploadedBy: "Riya Oraon", uploadedAt: "2026-04-05", size: "3.2 MB" },
      { id: "doc2_2", name: "Laboratory_Testing_Sanity_Report.pdf", uploadedBy: "Dr. S. K. Dutta", uploadedAt: "2026-04-12", size: "2.1 MB" },
    ],
  },
];

export interface FundingRecord {
  projectId: string;
  projectTitle: string;
  universityName: string;
  committed: number;
  disbursed: number;
  nextMilestone: string;
  status: "Fully Disbursed" | "Partially Disbursed" | "Pending Approval";
  breakdown: {
    phase: string;
    amount: number;
    disbursementDate?: string;
    status: "Completed" | "Pending Approval" | "Locked";
    condition: string;
  }[];
}

export const fundingRecords: FundingRecord[] = [
  {
    projectId: "JH-WTR-2026-001842",
    projectTitle: "Smart Water Monitoring System",
    universityName: "BIT Mesra",
    committed: 450000,
    disbursed: 200000,
    nextMilestone: "Milestone 3 Waterproof Enclosure Assembly",
    status: "Partially Disbursed",
    breakdown: [
      { phase: "Prototype Core Sensors Integration", amount: 200000, disbursementDate: "2026-03-25", status: "Completed", condition: "Successful initial prototype breadboard demonstration." },
      { phase: "Enclosure Manufacturing & Enclosure Assembly", amount: 150000, status: "Pending Approval", condition: "Assembly of field testing enclosures and waterproofing check." },
      { phase: "Final Field Testing & 15-day Trial", amount: 100000, status: "Locked", condition: "15-day successful operation and data relay to regional board portal." },
    ],
  },
  {
    projectId: "JH-HLT-2026-000148",
    projectTitle: "Rural Health Diagnostics Hub",
    universityName: "BIT Mesra",
    committed: 550000,
    disbursed: 350000,
    nextMilestone: "Milestone 3 Low-bandwidth compression testing",
    status: "Partially Disbursed",
    breakdown: [
      { phase: "Project Commencement & PCB components ordering", amount: 200000, disbursementDate: "2026-03-05", status: "Completed", condition: "Approval of schematics by review committee." },
      { phase: "Staging deployment diagnostics enclosure validation", amount: 150000, disbursementDate: "2026-04-08", status: "Completed", condition: "Integration of diagnostic tools into protective field case." },
      { phase: "Deployment phase (Ormanjhi PHC)", amount: 200000, status: "Pending Approval", condition: "Successful setup and testing with 50 test patient cases at Ormanjhi PHC." },
    ],
  },
];

export interface MentorshipSession {
  id: string;
  projectId: string;
  projectTitle: string;
  universityName: string;
  facultyMentor: string;
  studentsCount: number;
  mentorName: string;
  topic: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed";
  meetingLink?: string;
  notes?: string;
}

export const mentorshipSessions: MentorshipSession[] = [
  {
    id: "m-sess1",
    projectId: "JH-WTR-2026-001842",
    projectTitle: "Smart Water Monitoring System",
    universityName: "BIT Mesra",
    facultyMentor: "Dr. Alok Vardhan",
    studentsCount: 3,
    mentorName: "Siddharth Sen",
    topic: "Low-power deep sleep cycles for ESP32 and cellular transmitters",
    date: "2026-04-29",
    time: "15:00 - 16:00",
    status: "Scheduled",
    meetingLink: "https://meet.abctech.in/water-iot",
  },
  {
    id: "m-sess2",
    projectId: "JH-HLT-2026-000148",
    projectTitle: "Rural Health Diagnostics Hub",
    universityName: "BIT Mesra",
    facultyMentor: "Dr. S. K. Dutta",
    studentsCount: 3,
    mentorName: "Priya Nair (Senior Bio-Engineer)",
    topic: "EMG and ECG noise suppression in battery-operated circuits",
    date: "2026-04-12",
    time: "11:00 - 12:30",
    status: "Completed",
    notes: "Reviewed circuit board schematics. Suggested adding bypass capacitors closer to the instrumentation op-amps to limit high frequency noise from the switching regulators.",
  },
  {
    id: "m-sess3",
    projectId: "JH-AGR-2026-000210",
    projectTitle: "AI-Driven Smart Irrigation Controllers",
    universityName: "Birsa Agricultural University",
    facultyMentor: "Dr. Rajesh Prasad",
    studentsCount: 2,
    mentorName: "Dr. Arvind Roy (Data Scientist)",
    topic: "Soil moisture forecast models using LSTM networks",
    date: "2026-04-18",
    time: "14:00 - 15:30",
    status: "Completed",
    notes: "Compared model performance between linear regression and a 2-layer LSTM model. Recommended simplifying the LSTM layers to fit on low-resource microcontrollers if calculations are processed edge-side.",
  },
];

export interface PilotDeploymentState {
  id: string;
  projectTitle: string;
  universityName: string;
  district: string;
  locationName: string;
  industryPartner: string;
  stage: "Prototype" | "Lab Testing" | "Field Testing" | "Pilot" | "Deployment" | "Completed";
  progress: number;
  startDate: string;
  targetUnits: number;
  deployedUnits: number;
  beneficiariesCount: number;
}

export const pilotDeployments: PilotDeploymentState[] = [
  {
    id: "p-dep1",
    projectTitle: "Smart Water Monitoring System",
    universityName: "BIT Mesra",
    district: "Ranchi",
    locationName: "Kanke Road Cluster (Govt. Middle School neighborhood)",
    industryPartner: "ABC Technologies",
    stage: "Prototype",
    progress: 40,
    startDate: "2026-05-15",
    targetUnits: 5,
    deployedUnits: 0,
    beneficiariesCount: 1200,
  },
  {
    id: "p-dep2",
    projectTitle: "Rural Health Diagnostics Hub",
    universityName: "BIT Mesra",
    district: "Palamu",
    locationName: "Ormanjhi PHC (Primary Health Centre)",
    industryPartner: "ABC Technologies",
    stage: "Field Testing",
    progress: 75,
    startDate: "2026-04-10",
    targetUnits: 2,
    deployedUnits: 1,
    beneficiariesCount: 6000,
  },
  {
    id: "p-dep3",
    projectTitle: "AI-Driven Smart Irrigation Controllers",
    universityName: "Birsa Agricultural University",
    district: "Hazaribagh",
    locationName: "Bishnugarh block cooperating farmlands",
    industryPartner: "BAU Agri Ventures & Tata Trusts",
    stage: "Pilot",
    progress: 90,
    startDate: "2026-02-15",
    targetUnits: 15,
    deployedUnits: 12,
    beneficiariesCount: 2500,
  },
];

export interface ImpactMetric {
  id: string;
  projectTitle: string;
  sector: string;
  district: string;
  metricLabel: string;
  beforeValue: string;
  afterValue: string;
  beneficiaries: number;
  fundingContributed: number;
  mentorshipHours: number;
}

export const impactMetrics: ImpactMetric[] = [
  {
    id: "imp1",
    projectTitle: "Rural Health Diagnostics Hub",
    sector: "Healthcare",
    district: "Palamu",
    metricLabel: "Time to access diagnostic checks",
    beforeValue: "1.5 hours travel time",
    afterValue: "15 minutes at local PHC",
    beneficiaries: 6000,
    fundingContributed: 350000,
    mentorshipHours: 12,
  },
  {
    id: "imp2",
    projectTitle: "AI-Driven Smart Irrigation Controllers",
    sector: "Agriculture",
    district: "Hazaribagh",
    metricLabel: "Water conservation rate",
    beforeValue: "Excessive open flooding",
    afterValue: "35% water usage reduction",
    beneficiaries: 2500,
    fundingContributed: 180000,
    mentorshipHours: 8,
  },
  {
    id: "imp3",
    projectTitle: "Smart Water Monitoring System",
    sector: "Water Management",
    district: "Ranchi",
    metricLabel: "Water availability per day",
    beforeValue: "2 days / week",
    afterValue: "6 days / week",
    beneficiaries: 1200,
    fundingContributed: 200000,
    mentorshipHours: 18,
  },
];

export interface IndustryNotification {
  id: string;
  type: "New Recommendation" | "Milestone Complete" | "Collaboration Accepted" | "Message Received" | "Document Uploaded" | "Funding Milestone";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  projectTitle: string;
  projectId?: string;
  timeLabel: "Today" | "Yesterday" | "Earlier";
}

export const industryNotifications: IndustryNotification[] = [
  {
    id: "in1",
    type: "New Recommendation",
    title: "New 95% Match Recommended",
    message: "A new challenge regarding Coal dust pollution monitoring in Jharia has been validated. Real-time IoT sensor network requested.",
    timestamp: "2026-08-27T11:00:00+05:30",
    read: false,
    projectTitle: "Coal dust pollution monitoring in Jharia",
    timeLabel: "Today",
  },
  {
    id: "in2",
    type: "Message Received",
    title: "Message from Dr. Alok Vardhan",
    message: "'Hello team. We received the depth transmitters today...'",
    timestamp: "2026-08-27T09:30:00+05:30",
    read: false,
    projectTitle: "Smart Water Monitoring System",
    projectId: "JH-WTR-2026-001842",
    timeLabel: "Today",
  },
  {
    id: "in3",
    type: "Document Uploaded",
    title: "New document uploaded",
    message: "Rahul Kumar uploaded 'Groundwater_Depth_Calibration_Log.xlsx'.",
    timestamp: "2026-08-26T16:00:00+05:30",
    read: true,
    projectTitle: "Smart Water Monitoring System",
    projectId: "JH-WTR-2026-001842",
    timeLabel: "Yesterday",
  },
  {
    id: "in4",
    type: "Collaboration Accepted",
    title: "Collaboration Request Approved",
    message: "BIT Mesra Civil department approved ABC Technologies as Industry Mentor for Smart Water Monitoring.",
    timestamp: "2026-08-20T14:00:00+05:30",
    read: true,
    projectTitle: "Smart Water Monitoring System",
    projectId: "JH-WTR-2026-001842",
    timeLabel: "Earlier",
  },
];
