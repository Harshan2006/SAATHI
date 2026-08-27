import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  Cpu,
  Handshake,
  Settings,
  History,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  X,
  FileCheck,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useToast } from "../../components/shared/Toast";
import { useAuth } from "../../components/shared/Auth";
import { saveIndustryProfile, calculateCompleteness } from "../../store/industryStore";
import type { IndustryProfile, ExperienceRecord } from "../../types/industry";

const DISTRICTS_LIST = ["Ranchi", "East Singhbhum", "Dhanbad", "Hazaribagh", "Palamu", "Bokaro", "Deoghar", "Giridih"];

export default function RegisterFlow() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRegistered, setIsRegistered] = useState(false);

  // Profile state matching the registered data model schema
  const [profile, setProfile] = useState<IndustryProfile>({
    account: { fullName: "", designation: "", officialEmail: "", phone: "" },
    company: {
      companyId: "IND-2026-00124",
      companyName: "",
      companyType: "Corporate",
      description: "",
      website: "",
      email: "",
      phone: "",
      companySize: "10 - 50 employees",
      state: "Jharkhand",
      district: "Ranchi",
      city: "",
      address: "",
    },
    expertise: { technologies: [], domains: [], customCapabilities: [] },
    support: {
      capabilities: [],
      fundingRange: { min: 50000, max: 500000 },
      fundingTypes: [],
      mentorshipAreas: [],
      mentorCount: 0,
      mentorshipHours: 0,
      mentorshipMode: [],
    },
    preferences: { projectStages: [], sectors: [], locations: [], districts: [], impactAreas: [] },
    experience: { previousProjects: [], universityCollaborations: [], governmentCollaborations: [], socialImpactProjects: [] },
    verification: { status: "Pending Verification", registrationNumber: "", gstin: "", documents: [] },
    completeness: 0,
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Experience temp input states
  const [expType, setExpType] = useState<"projects" | "uni" | "gov" | "social">("projects");
  const [tempExp, setTempExp] = useState<ExperienceRecord>({ title: "", description: "", domain: "", year: "", impact: "" });

  const handleAccountChange = (field: string, val: string) => {
    setProfile((prev) => ({ ...prev, account: { ...prev.account, [field]: val } }));
  };

  const handleCompanyChange = (field: string, val: string) => {
    setProfile((prev) => ({ ...prev, company: { ...prev.company, [field]: val } }));
  };

  const toggleTech = (tech: string) => {
    const techs = profile.expertise.technologies.includes(tech)
      ? profile.expertise.technologies.filter((t) => t !== tech)
      : [...profile.expertise.technologies, tech];
    setProfile((prev) => ({ ...prev, expertise: { ...prev.expertise, technologies: techs } }));
  };

  const toggleDomain = (domain: string) => {
    const doms = profile.expertise.domains.includes(domain)
      ? profile.expertise.domains.filter((d) => d !== domain)
      : [...profile.expertise.domains, domain];
    setProfile((prev) => ({ ...prev, expertise: { ...prev.expertise, domains: doms } }));
  };

  const [customCapInput, setCustomCapInput] = useState("");
  const addCustomCap = () => {
    if (!customCapInput.trim()) return;
    setProfile((prev) => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        customCapabilities: [...prev.expertise.customCapabilities, customCapInput.trim()],
      },
    }));
    setCustomCapInput("");
  };

  const removeCustomCap = (idx: number) => {
    setProfile((prev) => ({
      ...prev,
      expertise: {
        ...prev.expertise,
        customCapabilities: prev.expertise.customCapabilities.filter((_, i) => i !== idx),
      },
    }));
  };

  const toggleSupportCapability = (cap: string) => {
    const caps = profile.support.capabilities.includes(cap)
      ? profile.support.capabilities.filter((c) => c !== cap)
      : [...profile.support.capabilities, cap];
    setProfile((prev) => ({ ...prev, support: { ...prev.support, capabilities: caps } }));
  };

  const toggleFundingType = (type: string) => {
    const types = profile.support.fundingTypes.includes(type)
      ? profile.support.fundingTypes.filter((t) => t !== type)
      : [...profile.support.fundingTypes, type];
    setProfile((prev) => ({ ...prev, support: { ...prev.support, fundingTypes: types } }));
  };

  const toggleMentorshipMode = (mode: string) => {
    const modes = profile.support.mentorshipMode.includes(mode)
      ? profile.support.mentorshipMode.filter((m) => m !== mode)
      : [...profile.support.mentorshipMode, mode];
    setProfile((prev) => ({ ...prev, support: { ...prev.support, mentorshipMode: modes } }));
  };

  const togglePrefStage = (stage: string) => {
    const stages = profile.preferences.projectStages.includes(stage)
      ? profile.preferences.projectStages.filter((s) => s !== stage)
      : [...profile.preferences.projectStages, stage];
    setProfile((prev) => ({ ...prev, preferences: { ...prev.preferences, projectStages: stages } }));
  };

  const togglePrefSector = (sector: string) => {
    const sectors = profile.preferences.sectors.includes(sector)
      ? profile.preferences.sectors.filter((s) => s !== sector)
      : [...profile.preferences.sectors, sector];
    setProfile((prev) => ({ ...prev, preferences: { ...prev.preferences, sectors: sectors } }));
  };

  const togglePrefLocation = (loc: string) => {
    const locations = profile.preferences.locations.includes(loc)
      ? profile.preferences.locations.filter((l) => l !== loc)
      : [...profile.preferences.locations, loc];
    setProfile((prev) => ({ ...prev, preferences: { ...prev.preferences, locations: locations } }));
  };

  const togglePrefDistrict = (dist: string) => {
    const districts = profile.preferences.districts.includes(dist)
      ? profile.preferences.districts.filter((d) => d !== dist)
      : [...profile.preferences.districts, dist];
    setProfile((prev) => ({ ...prev, preferences: { ...prev.preferences, districts: districts } }));
  };

  const togglePrefImpact = (impact: string) => {
    const impacts = profile.preferences.impactAreas.includes(impact)
      ? profile.preferences.impactAreas.filter((i) => i !== impact)
      : [...profile.preferences.impactAreas, impact];
    setProfile((prev) => ({ ...prev, preferences: { ...prev.preferences, impactAreas: impacts } }));
  };

  const [mentorshipAreaInput, setMentorshipAreaInput] = useState("");
  const addMentorshipArea = () => {
    if (!mentorshipAreaInput.trim()) return;
    setProfile((prev) => ({
      ...prev,
      support: {
        ...prev.support,
        mentorshipAreas: [...prev.support.mentorshipAreas, mentorshipAreaInput.trim()],
      },
    }));
    setMentorshipAreaInput("");
  };

  const addExperience = () => {
    if (!tempExp.title.trim()) {
      showToast("Please enter a project title.", "warning");
      return;
    }
    const record: ExperienceRecord = { ...tempExp };
    setProfile((prev) => {
      const exp = { ...prev.experience };
      if (expType === "projects") exp.previousProjects = [...exp.previousProjects, record];
      else if (expType === "uni") exp.universityCollaborations = [...exp.universityCollaborations, record];
      else if (expType === "gov") exp.governmentCollaborations = [...exp.governmentCollaborations, record];
      else exp.socialImpactProjects = [...exp.socialImpactProjects, record];
      return { ...prev, experience: exp };
    });
    setTempExp({ title: "", description: "", domain: "", year: "", impact: "" });
    showToast("Experience record added.", "success");
  };

  const removeExperience = (type: "projects" | "uni" | "gov" | "social", idx: number) => {
    setProfile((prev) => {
      const exp = { ...prev.experience };
      if (type === "projects") exp.previousProjects = exp.previousProjects.filter((_, i) => i !== idx);
      else if (type === "uni") exp.universityCollaborations = exp.universityCollaborations.filter((_, i) => i !== idx);
      else if (type === "gov") exp.governmentCollaborations = exp.governmentCollaborations.filter((_, i) => i !== idx);
      else exp.socialImpactProjects = exp.socialImpactProjects.filter((_, i) => i !== idx);
      return { ...prev, experience: exp };
    });
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!profile.account.fullName || !profile.account.designation || !profile.account.officialEmail) {
        showToast("Please fill in all account fields.", "warning");
        return;
      }
      if (password !== confirmPassword) {
        showToast("Passwords do not match.", "warning");
        return;
      }
    }
    if (currentStep === 2) {
      if (!profile.company.companyName || !profile.company.description || !profile.company.city) {
        showToast("Please fill in required company fields.", "warning");
        return;
      }
    }
    if (currentStep === 7) {
      if (!profile.verification.registrationNumber) {
        showToast("Registration number is required for validation.", "warning");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleComplete = () => {
    try {
      register(
        profile.account.officialEmail,
        profile.account.fullName,
        profile.account.phone || "+91 99999 99999",
        password
      );
      const finalProfile = { ...profile, completeness: calculateCompleteness(profile) };
      saveIndustryProfile(finalProfile);
      setIsRegistered(true);
      showToast("Registration completed!", "success");
    } catch (err: any) {
      showToast(err.message || "Registration failed. Username may already exist.", "warning");
    }
  };

  const steps = [
    { label: "Account Info", icon: User },
    { label: "Company Info", icon: Building2 },
    { label: "Expertise", icon: Cpu },
    { label: "Contributions", icon: Handshake },
    { label: "Preferences", icon: Settings },
    { label: "Experience", icon: History },
    { label: "Verification", icon: ShieldCheck },
    { label: "Preview", icon: FileCheck },
  ];

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-card border border-ink-100 bg-surface p-8 shadow-md text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600 animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-ink-900">Registration Successful!</h2>
            <p className="text-xs text-ink-500">Your organization has been successfully registered.</p>
          </div>

          <div className="bg-surface-alt border border-ink-100 p-4 rounded text-xs text-ink-700">
            <span className="font-semibold text-ink-400 uppercase tracking-wider block text-[10px]">Mock Industry ID</span>
            <p className="font-mono font-bold text-base mt-1 text-ink-850">IND-2026-00124</p>
          </div>

          <p className="text-xs text-ink-600 leading-relaxed max-w-sm mx-auto">
            You can now log in using your official email. Your capabilities profile has been loaded into the AI project matcher.
          </p>

          <button
            onClick={() => {
              navigate("/industry/dashboard");
            }}
            className="w-full rounded bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt py-8 font-sans">
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        {/* Header logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-teal-600">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-ink-950">Tech Foxies</h1>
            <p className="text-[10px] text-ink-400 uppercase tracking-wider font-semibold">Industry Portal Registration</p>
          </div>
        </div>

        {/* Stepper indicators */}
        <div className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm overflow-x-auto">
          <div className="flex justify-between items-center min-w-[640px] px-2">
            {steps.map((st, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isPassed = currentStep > stepNum;

              return (
                <div key={idx} className="flex items-center flex-1 last:flex-initial">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border transition",
                        isActive
                          ? "bg-teal-600 text-white border-teal-600 ring-2 ring-teal-100"
                          : isPassed
                          ? "bg-teal-50 border-teal-500 text-teal-600"
                          : "bg-surface border-ink-200 text-ink-400"
                      )}
                    >
                      <st.icon className="h-4 w-4" />
                    </div>
                    <span className={cn("text-[9px] font-semibold tracking-wide uppercase", isActive ? "text-teal-700 font-bold" : "text-ink-400")}>
                      {st.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={cn("flex-1 h-0.5 mx-2 bg-ink-200", isPassed && "bg-teal-500")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-card border border-ink-100 bg-surface p-6 shadow-sm min-h-[300px]">
          {/* Step 1: Account */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-ink-900">Step 1: Account Information</h3>
                <p className="text-xs text-ink-500">Authorized representative credential setup.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Full Name</label>
                  <input
                    type="text"
                    value={profile.account.fullName}
                    onChange={(e) => handleAccountChange("fullName", e.target.value)}
                    placeholder="e.g. Siddharth Sen"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Designation</label>
                  <input
                    type="text"
                    value={profile.account.designation}
                    onChange={(e) => handleAccountChange("designation", e.target.value)}
                    placeholder="e.g. Engineering Lead"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Official Email</label>
                  <input
                    type="email"
                    value={profile.account.officialEmail}
                    onChange={(e) => handleAccountChange("officialEmail", e.target.value)}
                    placeholder="siddharth@abctech.in"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={profile.account.phone}
                    onChange={(e) => handleAccountChange("phone", e.target.value)}
                    placeholder="9876543210"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-ink-900">Step 2: Company Information</h3>
                <p className="text-xs text-ink-500">Corporate details and geographic context.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Company Name</label>
                  <input
                    type="text"
                    value={profile.company.companyName}
                    onChange={(e) => handleCompanyChange("companyName", e.target.value)}
                    placeholder="e.g. ABC Technologies"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Company Type</label>
                  <select
                    value={profile.company.companyType}
                    onChange={(e) => handleCompanyChange("companyType", e.target.value)}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    {["Startup", "MSME", "Corporate", "CSR Organization", "Research Organization", "Innovation Hub", "Other"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Company Description</label>
                  <textarea
                    value={profile.company.description}
                    onChange={(e) => handleCompanyChange("description", e.target.value)}
                    rows={3}
                    placeholder="Describe your corporate vision, sectors of interest..."
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none leading-relaxed"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Official Website</label>
                  <input
                    type="text"
                    value={profile.company.website}
                    onChange={(e) => handleCompanyChange("website", e.target.value)}
                    placeholder="https://www.abctech.in"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Company Size</label>
                  <select
                    value={profile.company.companySize}
                    onChange={(e) => handleCompanyChange("companySize", e.target.value)}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none cursor-pointer"
                  >
                    {["1 - 10 employees", "10 - 50 employees", "50 - 250 employees", "250 - 500 employees", "500+ employees"].map((sz) => (
                      <option key={sz}>{sz}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Corporate Email</label>
                  <input
                    type="email"
                    value={profile.company.email}
                    onChange={(e) => handleCompanyChange("email", e.target.value)}
                    placeholder="contact@abctech.in"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Corporate Phone</label>
                  <input
                    type="tel"
                    value={profile.company.phone}
                    onChange={(e) => handleCompanyChange("phone", e.target.value)}
                    placeholder="0651-234567"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="border-t border-ink-100 pt-4 space-y-3">
                <span className="text-xs font-bold text-ink-950 block uppercase tracking-wider">Company Location (Jharkhand Focus)</span>
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink-500 block uppercase">State</label>
                    <input
                      type="text"
                      value={profile.company.state}
                      onChange={(e) => handleCompanyChange("state", e.target.value)}
                      className="w-full rounded border border-ink-200 bg-surface-alt px-3 py-2 text-xs focus:outline-none"
                      disabled
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-ink-500 block uppercase">District</label>
                    <select
                      value={profile.company.district}
                      onChange={(e) => handleCompanyChange("district", e.target.value)}
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none cursor-pointer"
                    >
                      {DISTRICTS_LIST.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-ink-500 block uppercase">City / Town</label>
                    <input
                      type="text"
                      value={profile.company.city}
                      onChange={(e) => handleCompanyChange("city", e.target.value)}
                      placeholder="e.g. Ranchi"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-ink-500 block uppercase">Full Address</label>
                    <input
                      type="text"
                      value={profile.company.address}
                      onChange={(e) => handleCompanyChange("address", e.target.value)}
                      placeholder="e.g. Khelgaon Complex, Ranchi"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Expertise */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-ink-900">Step 3: Expertise & Technologies</h3>
                <p className="text-xs text-ink-500">Define capabilities to populate dynamic match algorithms.</p>
              </div>

              {/* Technologies Multi-select */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-ink-500 uppercase">Core Technologies</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "AI / ML", "IoT", "Cloud Computing", "Embedded Systems", "Robotics", "GIS",
                    "Data Analytics", "Mobile Development", "Web Development", "Hardware",
                    "Electronics", "Cybersecurity", "Manufacturing", "Product Development",
                    "Research & Development"
                  ].map((tech) => {
                    const isSel = profile.expertise.technologies.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTech(tech)}
                        className={cn(
                          "rounded border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                          isSel
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                        )}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom technology input */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-ink-500 uppercase">Add Custom Capability</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCapInput}
                    onChange={(e) => setCustomCapInput(e.target.value)}
                    placeholder="e.g. Waterproof sensor casing"
                    className="flex-1 rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomCap}
                    className="rounded bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {profile.expertise.customCapabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {profile.expertise.customCapabilities.map((cc, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded bg-ink-100 px-2 py-0.5 text-xs text-ink-700 border border-ink-200"
                      >
                        {cc}
                        <button type="button" onClick={() => removeCustomCap(i)} className="hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Company Domain Expertise */}
              <div className="space-y-2 border-t border-ink-100 pt-4">
                <span className="block text-xs font-bold text-ink-500 uppercase">Sectors / Domains of Expertise</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Agriculture", "Healthcare", "Water Management", "Education", "Environment",
                    "Energy", "Transportation", "Rural Development", "Urban Infrastructure",
                    "Sanitation", "Accessibility", "Public Services"
                  ].map((dom) => {
                    const isSel = profile.expertise.domains.includes(dom);
                    return (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => toggleDomain(dom)}
                        className={cn(
                          "rounded border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                          isSel
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                        )}
                      >
                        {dom}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Support Capabilities */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-ink-900">Step 4: Contributions & Support Capabilities</h3>
                <p className="text-xs text-ink-500">Define what resources your organization will deploy.</p>
              </div>

              {/* Support Multi-select */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-ink-500 uppercase">
                  What can your organization contribute to societal innovation projects?
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Funding", "Technical Mentorship", "Software", "Hardware", "Infrastructure",
                    "Prototyping", "Manufacturing", "Testing", "Research Collaboration",
                    "Technology Transfer", "Field Deployment", "Product Development", "Other"
                  ].map((cap) => {
                    const isSel = profile.support.capabilities.includes(cap);
                    return (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => toggleSupportCapability(cap)}
                        className={cn(
                          "rounded border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                          isSel
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                        )}
                      >
                        {cap}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Funding Inputs */}
              {profile.support.capabilities.includes("Funding") && (
                <div className="border-t border-ink-100 pt-4 space-y-3.5">
                  <span className="text-xs font-bold text-ink-950 block uppercase tracking-wider">Funding Parameters</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label htmlFor="minFunding" className="font-bold text-ink-500 block uppercase">Minimum Funding per project (INR)</label>
                      <input
                        id="minFunding"
                        type="number"
                        value={profile.support.fundingRange?.min || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            support: {
                              ...prev.support,
                              fundingRange: {
                                min: Number(e.target.value),
                                max: prev.support.fundingRange?.max || 500000,
                              },
                            },
                          }))
                        }
                        className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="maxFunding" className="font-bold text-ink-500 block uppercase">Maximum Funding per project (INR)</label>
                      <input
                        id="maxFunding"
                        type="number"
                        value={profile.support.fundingRange?.max || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            support: {
                              ...prev.support,
                              fundingRange: {
                                min: prev.support.fundingRange?.min || 50000,
                                max: Number(e.target.value),
                              },
                            },
                          }))
                        }
                        className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-ink-500 block uppercase text-xs">Funding Purposes</label>
                    <div className="flex flex-wrap gap-2">
                      {["Project Funding", "Prototype Funding", "Pilot Funding", "Deployment Funding", "CSR Funding"].map((ft) => {
                        const isSel = profile.support.fundingTypes.includes(ft);
                        return (
                          <button
                            key={ft}
                            type="button"
                            onClick={() => toggleFundingType(ft)}
                            className={cn(
                              "rounded border px-2.5 py-1 text-xs transition cursor-pointer",
                              isSel
                                ? "bg-teal-50 border-teal-200 text-teal-700"
                                : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                            )}
                          >
                            {ft}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Mentorship Inputs */}
              {profile.support.capabilities.includes("Technical Mentorship") && (
                <div className="border-t border-ink-100 pt-4 space-y-4">
                  <span className="text-xs font-bold text-ink-955 block uppercase tracking-wider">Mentorship Parameters</span>
                  
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label htmlFor="mentorCount" className="font-bold text-ink-500 block uppercase">Available Mentors</label>
                      <input
                        id="mentorCount"
                        type="number"
                        value={profile.support.mentorCount || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            support: { ...prev.support, mentorCount: Number(e.target.value) },
                          }))
                        }
                        placeholder="e.g. 3"
                        className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="mentorHours" className="font-bold text-ink-500 block uppercase">Hours / Month</label>
                      <input
                        id="mentorHours"
                        type="number"
                        value={profile.support.mentorshipHours || ""}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            support: { ...prev.support, mentorshipHours: Number(e.target.value) },
                          }))
                        }
                        placeholder="e.g. 15"
                        className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-ink-500 block uppercase">Preferred Mode</label>
                      <div className="flex gap-1.5">
                        {["Online", "On-site", "Hybrid"].map((mode) => {
                          const isSel = profile.support.mentorshipMode.includes(mode);
                          return (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => toggleMentorshipMode(mode)}
                              className={cn(
                                "flex-1 rounded border py-2 text-xs transition cursor-pointer text-center font-semibold",
                                isSel
                                  ? "bg-teal-50 border-teal-200 text-teal-700"
                                  : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                              )}
                            >
                              {mode}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="mentorArea" className="block text-xs font-bold text-ink-500 uppercase">Mentorship Core Areas</label>
                    <div className="flex gap-2">
                      <input
                        id="mentorArea"
                        type="text"
                        value={mentorshipAreaInput}
                        onChange={(e) => setMentorshipAreaInput(e.target.value)}
                        placeholder="e.g. IoT Power optimization, Firmware design"
                        className="flex-1 rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addMentorshipArea}
                        className="rounded bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    {profile.support.mentorshipAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {profile.support.mentorshipAreas.map((ma, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded bg-teal-50 px-2 py-0.5 text-xs text-teal-700 border border-teal-100"
                          >
                            {ma}
                            <button
                              type="button"
                              onClick={() =>
                                setProfile((prev) => ({
                                  ...prev,
                                  support: {
                                    ...prev.support,
                                    mentorshipAreas: prev.support.mentorshipAreas.filter((_, idx) => idx !== i),
                                  },
                                }))
                              }
                              className="hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Preferences */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-ink-900">Step 5: Collaboration Preferences</h3>
                <p className="text-xs text-ink-500">Filter project recomendations accordingly.</p>
              </div>

              {/* Preferred Project Stage */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-ink-500 block uppercase">Preferred Project Stage</span>
                <div className="flex flex-wrap gap-2">
                  {["Early Research", "Prototype", "Testing", "Pilot", "Deployment"].map((stage) => {
                    const isSel = profile.preferences.projectStages.includes(stage);
                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => togglePrefStage(stage)}
                        className={cn(
                          "rounded border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                          isSel
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                        )}
                      >
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Sectors */}
              <div className="space-y-1.5 text-xs border-t border-ink-100 pt-3">
                <span className="font-bold text-ink-500 block uppercase">Preferred Sectors</span>
                <div className="flex flex-wrap gap-2">
                  {["Agriculture", "Water", "Healthcare", "Education", "Environment", "Energy", "Infrastructure", "Rural Development"].map((sec) => {
                    const isSel = profile.preferences.sectors.includes(sec);
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => togglePrefSector(sec)}
                        className={cn(
                          "rounded border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                          isSel
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                        )}
                      >
                        {sec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Geographic preference */}
              <div className="space-y-1.5 text-xs border-t border-ink-100 pt-3">
                <span className="font-bold text-ink-500 block uppercase">Preferred Collaboration Location</span>
                <div className="flex flex-wrap gap-2">
                  {["Jharkhand", "East India", "Pan India"].map((loc) => {
                    const isSel = profile.preferences.locations.includes(loc);
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => togglePrefLocation(loc)}
                        className={cn(
                          "rounded border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
                          isSel
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                        )}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Districts */}
              {profile.preferences.locations.includes("Jharkhand") && (
                <div className="space-y-1.5 text-xs border-t border-ink-100 pt-3">
                  <span className="font-bold text-ink-500 block uppercase">Preferred Districts in Jharkhand</span>
                  <div className="flex flex-wrap gap-2">
                    {DISTRICTS_LIST.map((dist) => {
                      const isSel = profile.preferences.districts.includes(dist);
                      return (
                        <button
                          key={dist}
                          type="button"
                          onClick={() => togglePrefDistrict(dist)}
                          className={cn(
                            "rounded border px-3 py-1 text-xs font-semibold transition cursor-pointer",
                            isSel
                              ? "bg-teal-50 border-teal-250 text-teal-700"
                              : "bg-surface border-ink-150 text-ink-650 hover:bg-surface-sunken"
                          )}
                        >
                          {dist}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Impact Areas */}
              <div className="space-y-1.5 text-xs border-t border-ink-100 pt-3">
                <span className="font-bold text-ink-500 block uppercase">Target Societal Impact Areas</span>
                <div className="flex flex-wrap gap-2">
                  {["Education", "Healthcare", "Agriculture", "Water", "Environment", "Accessibility", "Livelihood", "Rural Development", "Women Empowerment", "Other"].map((imp) => {
                    const isSel = profile.preferences.impactAreas.includes(imp);
                    return (
                      <button
                        key={imp}
                        type="button"
                        onClick={() => togglePrefImpact(imp)}
                        className={cn(
                          "rounded border px-2.5 py-1 text-xs transition cursor-pointer",
                          isSel
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : "bg-surface border-ink-200 text-ink-600 hover:bg-surface-sunken"
                        )}
                      >
                        {imp}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Experience */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-ink-900">Step 6: Previous Collaborations & Experience (Optional)</h3>
                <p className="text-xs text-ink-500">Provide logs of completed checks/projects to verify credibility.</p>
              </div>

              {/* Input details */}
              <div className="bg-surface-alt p-4 rounded border border-ink-100 text-xs space-y-3.5">
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 font-semibold text-ink-700 cursor-pointer">
                    <input type="radio" checked={expType === "projects"} onChange={() => setExpType("projects")} className="accent-teal-650" />
                    <span>Previous Project</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-ink-700 cursor-pointer">
                    <input type="radio" checked={expType === "uni"} onChange={() => setExpType("uni")} className="accent-teal-650" />
                    <span>University Collab</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-ink-700 cursor-pointer">
                    <input type="radio" checked={expType === "gov"} onChange={() => setExpType("gov")} className="accent-teal-650" />
                    <span>Govt Collab</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-semibold text-ink-700 cursor-pointer">
                    <input type="radio" checked={expType === "social"} onChange={() => setExpType("social")} className="accent-teal-650" />
                    <span>Social Project</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label htmlFor="expTitle" className="font-bold text-ink-500 block uppercase">Project Title</label>
                    <input
                      id="expTitle"
                      type="text"
                      value={tempExp.title}
                      onChange={(e) => setTempExp({ ...tempExp, title: e.target.value })}
                      placeholder="e.g. Kanke water telemetry"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="expDomain" className="font-bold text-ink-500 block uppercase">Domain / Technology</label>
                    <input
                      id="expDomain"
                      type="text"
                      value={tempExp.domain}
                      onChange={(e) => setTempExp({ ...tempExp, domain: e.target.value })}
                      placeholder="e.g. IoT, GSM"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="expYear" className="font-bold text-ink-500 block uppercase">Year</label>
                    <input
                      id="expYear"
                      type="text"
                      value={tempExp.year}
                      onChange={(e) => setTempExp({ ...tempExp, year: e.target.value })}
                      placeholder="e.g. 2025"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="expDesc" className="font-bold text-ink-500 block uppercase">Brief Description</label>
                    <input
                      id="expDesc"
                      type="text"
                      value={tempExp.description}
                      onChange={(e) => setTempExp({ ...tempExp, description: e.target.value })}
                      placeholder="e.g. Setup flow monitoring units..."
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="expImpact" className="font-bold text-ink-500 block uppercase">Impact / Result achieved</label>
                    <input
                      id="expImpact"
                      type="text"
                      value={tempExp.impact}
                      onChange={(e) => setTempExp({ ...tempExp, impact: e.target.value })}
                      placeholder="e.g. Equalized water access for 200 households"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition cursor-pointer"
                >
                  Add Experience Record
                </button>
              </div>

              {/* Rendered lists */}
              <div className="space-y-3.5 text-xs">
                {Object.entries(profile.experience).map(([key, list]: [string, any[]]) => {
                  if (list.length === 0) return null;
                  const label =
                    key === "previousProjects"
                      ? "Previous Projects"
                      : key === "universityCollaborations"
                      ? "University Collaborations"
                      : key === "governmentCollaborations"
                      ? "Government Collaborations"
                      : "Social Impact Projects";

                  return (
                    <div key={key} className="space-y-2">
                      <span className="font-bold text-ink-500 uppercase tracking-wider text-[10px] block border-b border-ink-100 pb-1">
                        {label}
                      </span>
                      <div className="space-y-2">
                        {list.map((rec, i) => (
                          <div key={i} className="flex items-center justify-between border border-ink-100 p-3 rounded bg-surface">
                            <div>
                              <p className="font-bold text-ink-900">{rec.title} ({rec.year})</p>
                              <p className="text-[10px] text-ink-500 mt-0.5">{rec.description}</p>
                              <p className="text-[10px] text-teal-700 font-semibold mt-1">Impact: {rec.impact}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExperience(key.replace("previous", "").replace("Collaborations", "").replace("Projects", "").toLowerCase() as any, i)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 7: Verification */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-ink-900">Step 7: Organization Verification</h3>
                <p className="text-xs text-ink-500">Authorized signatory declarations.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Authorized Representative Name</label>
                  <input
                    type="text"
                    value={profile.account.fullName}
                    className="w-full rounded border border-ink-200 bg-surface-alt px-3 py-2 text-xs focus:outline-none"
                    disabled
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Representative Designation</label>
                  <input
                    type="text"
                    value={profile.account.designation}
                    className="w-full rounded border border-ink-200 bg-surface-alt px-3 py-2 text-xs focus:outline-none"
                    disabled
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="orgEmail" className="font-bold text-ink-500 block uppercase">Official Organization Email</label>
                  <input
                    id="orgEmail"
                    type="email"
                    value={profile.company.email}
                    className="w-full rounded border border-ink-200 bg-surface-alt px-3 py-2 text-xs focus:outline-none"
                    disabled
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="regNum" className="font-bold text-ink-500 block uppercase">Organization Registration Number (CIN / UIN)</label>
                  <input
                    id="regNum"
                    type="text"
                    value={profile.verification.registrationNumber}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        verification: { ...prev.verification, registrationNumber: e.target.value },
                      }))
                    }
                    placeholder="e.g. U72200JH2026PTC018"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="gstin" className="font-bold text-ink-500 block uppercase">GSTIN (Optional)</label>
                  <input
                    id="gstin"
                    type="text"
                    value={profile.verification.gstin}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        verification: { ...prev.verification, gstin: e.target.value },
                      }))
                    }
                    placeholder="e.g. 20AAAAA0000A1Z5"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="certUpload" className="font-bold text-ink-500 block uppercase">Verification Documents (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      id="certUpload"
                      type="file"
                      disabled
                      className="hidden"
                    />
                    <div
                      onClick={() => {
                        setProfile((prev) => ({
                          ...prev,
                          verification: { ...prev.verification, documents: ["incorporation_certificate.pdf"] },
                        }));
                        showToast("Fictional document uploaded.", "success");
                      }}
                      className="w-full border border-ink-200 bg-surface p-2 rounded text-center text-ink-450 hover:bg-surface-sunken cursor-pointer transition text-xs font-semibold"
                    >
                      Choose incorporation certificate file
                    </div>
                  </div>
                  {profile.verification.documents.length > 0 && (
                    <p className="text-[11px] text-green-700 font-semibold mt-1">
                      Uploaded: {profile.verification.documents.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Preview */}
          {currentStep === 8 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-ink-900">Step 8: Complete Profile Preview</h3>
                <p className="text-xs text-ink-500">Verify your information before finalizing registration.</p>
              </div>

              {/* Complete details panel */}
              <div className="border border-ink-150 rounded bg-surface-alt divide-y divide-ink-150 text-xs">
                {/* Company details */}
                <div className="p-4 space-y-2">
                  <span className="font-bold text-ink-900 block text-sm">{profile.company.companyName}</span>
                  <div className="grid grid-cols-2 gap-2 text-ink-600">
                    <p><span className="font-semibold text-ink-800">Type:</span> {profile.company.companyType}</p>
                    <p><span className="font-semibold text-ink-800">Size:</span> {profile.company.companySize}</p>
                    <p className="col-span-2"><span className="font-semibold text-ink-800">Description:</span> {profile.company.description}</p>
                    <p><span className="font-semibold text-ink-800">Location:</span> {profile.company.city}, {profile.company.state}</p>
                  </div>
                </div>

                {/* Technologies */}
                <div className="p-4 space-y-1.5">
                  <span className="font-bold text-ink-850 block">Capabilities & Sectors</span>
                  <p className="text-ink-600">
                    <span className="font-semibold text-ink-800">Core Technologies:</span> {profile.expertise.technologies.join(", ") || "None"}
                  </p>
                  <p className="text-ink-600">
                    <span className="font-semibold text-ink-800">Domain Sectors:</span> {profile.expertise.domains.join(", ") || "None"}
                  </p>
                </div>

                {/* Support offering */}
                <div className="p-4 space-y-1.5">
                  <span className="font-bold text-ink-850 block">Contributions Offered</span>
                  <p className="text-ink-600">
                    <span className="font-semibold text-ink-800">Capabilities:</span> {profile.support.capabilities.join(", ") || "None"}
                  </p>
                  {profile.support.capabilities.includes("Funding") && (
                    <p className="text-ink-600">
                      <span className="font-semibold text-ink-800">CSR Funding range:</span> Min ₹{profile.support.fundingRange?.min.toLocaleString()} - Max ₹{profile.support.fundingRange?.max.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Preferences */}
                <div className="p-4 space-y-1.5">
                  <span className="font-bold text-ink-850 block">Target Preferences</span>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 text-ink-600">
                    <p><span className="font-semibold text-ink-800">Preferred Stages:</span> {profile.preferences.projectStages.join(", ") || "None"}</p>
                    <p><span className="font-semibold text-ink-800">Locations:</span> {profile.preferences.locations.join(", ") || "None"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Buttons */}
        <div className="flex justify-between items-center bg-surface p-4 rounded-card border border-ink-100 shadow-sm">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="rounded border border-ink-200 bg-surface px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-surface-sunken transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded bg-teal-600 px-5 py-2 text-xs font-bold text-white hover:bg-teal-700 transition flex items-center gap-1.5 cursor-pointer font-sans"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="rounded bg-teal-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition flex items-center gap-1.5 cursor-pointer font-sans"
            >
              Complete Registration <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
