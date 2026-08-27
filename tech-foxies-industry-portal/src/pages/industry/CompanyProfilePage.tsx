import { useState } from "react";
import {
  Save,
  Edit3,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useToast } from "../../components/shared/Toast";
import { getIndustryProfile, saveIndustryProfile, calculateCompleteness } from "../../store/industryStore";
import type { IndustryProfile, ExperienceRecord } from "../../types/industry";

const DISTRICTS_LIST = ["Ranchi", "East Singhbhum", "Dhanbad", "Hazaribagh", "Palamu", "Bokaro", "Deoghar", "Giridih"];

export default function CompanyProfilePage() {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Dynamic persistent state
  const [profile, setProfile] = useState<IndustryProfile>(getIndustryProfile());

  // Input states for custom tech, mentorship, experience
  const [expType, setExpType] = useState<"projects" | "uni" | "gov" | "social">("projects");
  const [tempExp, setTempExp] = useState<ExperienceRecord>({ title: "", description: "", domain: "", year: "", impact: "" });

  const capabilitiesList = ["AI / ML", "IoT", "Cloud Computing", "Embedded Systems", "Robotics", "GIS", "Data Analytics", "Mobile Development", "Web Development", "Hardware", "Electronics", "Cybersecurity", "Manufacturing", "Product Development", "Research & Development"];
  const supportList = ["Funding", "Technical Mentorship", "Software", "Hardware", "Infrastructure", "Prototyping", "Manufacturing", "Testing", "Research Collaboration", "Technology Transfer", "Field Deployment", "Product Development", "Other"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = { ...profile, completeness: calculateCompleteness(profile) };
    saveIndustryProfile(updatedProfile);
    setProfile(updatedProfile);
    setIsEditing(false);
    showToast("Corporate profile matching matrix updated successfully!", "success");
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

  const toggleSupportCapability = (cap: string) => {
    const caps = profile.support.capabilities.includes(cap)
      ? profile.support.capabilities.filter((c) => c !== cap)
      : [...profile.support.capabilities, cap];
    setProfile((prev) => ({ ...prev, support: { ...prev.support, capabilities: caps } }));
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

  const togglePrefDistrict = (dist: string) => {
    const districts = profile.preferences.districts.includes(dist)
      ? profile.preferences.districts.filter((d) => d !== dist)
      : [...profile.preferences.districts, dist];
    setProfile((prev) => ({ ...prev, preferences: { ...prev.preferences, districts: districts } }));
  };


  const addExperience = () => {
    if (!tempExp.title.trim()) return;
    const record = { ...tempExp };
    setProfile((prev) => {
      const exp = { ...prev.experience };
      if (expType === "projects") exp.previousProjects = [...exp.previousProjects, record];
      else if (expType === "uni") exp.universityCollaborations = [...exp.universityCollaborations, record];
      else if (expType === "gov") exp.governmentCollaborations = [...exp.governmentCollaborations, record];
      else exp.socialImpactProjects = [...exp.socialImpactProjects, record];
      return { ...prev, experience: exp };
    });
    setTempExp({ title: "", description: "", domain: "", year: "", impact: "" });
    showToast("Experience log added.", "success");
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

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Company Profile</h2>
          <p className="text-sm text-ink-500 mt-1">
            Industry ID: <span className="font-mono font-bold text-ink-800">{profile.company.companyId}</span>
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Edit3 className="h-4 w-4" /> {isEditing ? "View Profile" : "Edit Profile"}
        </button>
      </div>

      {/* Completeness bar */}
      <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span className="font-semibold">Match Matrix Completeness</span>
          <span className="font-bold text-teal-700">{profile.completeness}% filled</span>
        </div>
        <div className="w-full bg-ink-100 rounded-full h-1.5 overflow-hidden">
          <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${profile.completeness}%` }} />
        </div>
        {profile.completeness < 100 && (
          <p className="text-[10px] text-ink-400">
            * Complete previous experience logs or verification uploads to achieve 100% suitability matches.
          </p>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Core Info Inputs */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic details */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Company Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Company Name</label>
                  <input
                    type="text"
                    value={profile.company.companyName}
                    onChange={(e) => handleCompanyChange("companyName", e.target.value)}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Company Type</label>
                  <select
                    value={profile.company.companyType}
                    onChange={(e) => handleCompanyChange("companyType", e.target.value)}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  >
                    {["Startup", "MSME", "Corporate", "CSR Organization", "Research Organization", "Innovation Hub", "Other"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Description</label>
                  <textarea
                    value={profile.company.description}
                    onChange={(e) => handleCompanyChange("description", e.target.value)}
                    rows={4}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none leading-relaxed"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Website</label>
                  <input
                    type="text"
                    value={profile.company.website}
                    onChange={(e) => handleCompanyChange("website", e.target.value)}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Email</label>
                  <input
                    type="email"
                    value={profile.company.email}
                    onChange={(e) => handleCompanyChange("email", e.target.value)}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Phone</label>
                  <input
                    type="text"
                    value={profile.company.phone}
                    onChange={(e) => handleCompanyChange("phone", e.target.value)}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-ink-500 block uppercase">Company Size</label>
                  <input
                    type="text"
                    value={profile.company.companySize}
                    onChange={(e) => handleCompanyChange("companySize", e.target.value)}
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Support parameters */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Contributions & Support Capabilities
              </h3>
              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <span className="font-bold text-ink-500 block uppercase">Support Offerings</span>
                  <div className="flex flex-wrap gap-2">
                    {supportList.map((sup) => {
                      const isSel = profile.support.capabilities.includes(sup);
                      return (
                        <button
                          key={sup}
                          type="button"
                          onClick={() => toggleSupportCapability(sup)}
                          className={cn(
                            "rounded border px-2.5 py-1 transition cursor-pointer",
                            isSel ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-surface border-ink-200 text-ink-600"
                          )}
                        >
                          {sup}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {profile.support.capabilities.includes("Funding") && (
                  <div className="grid grid-cols-2 gap-4 border-t border-ink-100 pt-3">
                    <div className="space-y-1">
                      <label className="font-bold text-ink-500 block uppercase">Min Funding Amount (INR)</label>
                      <input
                        type="number"
                        value={profile.support.fundingRange?.min || 0}
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
                      <label className="font-bold text-ink-500 block uppercase">Max Funding Amount (INR)</label>
                      <input
                        type="number"
                        value={profile.support.fundingRange?.max || 0}
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
                )}
              </div>
            </div>

            {/* Experience editor */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Experience Records
              </h3>
              
              <div className="bg-surface-alt p-4 rounded border border-ink-100 text-xs space-y-3.5">
                <div className="flex gap-4">
                  {["projects", "uni", "gov", "social"].map((t) => (
                    <label key={t} className="flex items-center gap-1.5 font-semibold text-ink-700 cursor-pointer">
                      <input type="radio" checked={expType === t} onChange={() => setExpType(t as any)} className="accent-teal-650" />
                      <span className="capitalize">{t}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={tempExp.title}
                    onChange={(e) => setTempExp({ ...tempExp, title: e.target.value })}
                    placeholder="Project Title"
                    className="rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tempExp.domain}
                    onChange={(e) => setTempExp({ ...tempExp, domain: e.target.value })}
                    placeholder="Technology Domain"
                    className="rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tempExp.year}
                    onChange={(e) => setTempExp({ ...tempExp, year: e.target.value })}
                    placeholder="Year"
                    className="rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={tempExp.description}
                    onChange={(e) => setTempExp({ ...tempExp, description: e.target.value })}
                    placeholder="Description"
                    className="rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tempExp.impact}
                    onChange={(e) => setTempExp({ ...tempExp, impact: e.target.value })}
                    placeholder="Social Impact Result"
                    className="rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition"
                >
                  Add Record
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {Object.entries(profile.experience).map(([key, list]: [string, any[]]) => {
                  if (list.length === 0) return null;
                  return (
                    <div key={key} className="space-y-2">
                      <span className="font-bold text-ink-500 uppercase text-[10px] block border-b border-ink-100 pb-1">{key}</span>
                      {list.map((rec, i) => (
                        <div key={i} className="flex justify-between items-center border border-ink-100 p-2 rounded bg-surface">
                          <div>
                            <p className="font-semibold text-ink-900">{rec.title} ({rec.year})</p>
                            <p className="text-[10px] text-teal-700 font-medium">Impact: {rec.impact}</p>
                          </div>
                          <button type="button" onClick={() => removeExperience(key.replace("previous", "").replace("Collaborations", "").replace("Projects", "").toLowerCase() as any, i)} className="text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Matrix preferences side column */}
          <div className="space-y-5">
            {/* Tech checklist */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Core Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {capabilitiesList.map((cap) => {
                  const isSel = profile.expertise.technologies.includes(cap);
                  return (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => toggleTech(cap)}
                      className={cn(
                        "rounded px-2.5 py-1 text-xs font-semibold border transition",
                        isSel ? "bg-teal-50 border-teal-250 text-teal-700" : "bg-surface border-ink-200 text-ink-500"
                      )}
                    >
                      {cap}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stages & preferences checklist */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Project Preferences
              </h3>
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-ink-500 block uppercase">Project Stages</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {["Early Research", "Prototype", "Testing", "Pilot", "Deployment"].map((stg) => {
                      const isSel = profile.preferences.projectStages.includes(stg);
                      return (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => togglePrefStage(stg)}
                          className={cn(
                            "rounded px-2 py-0.5 border transition",
                            isSel ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-surface border-ink-100 text-ink-500"
                          )}
                        >
                          {stg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 border-t border-ink-100 pt-3">
                  <span className="font-bold text-ink-500 block uppercase">Sectors</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {["Agriculture", "Water", "Healthcare", "Education", "Environment", "Energy", "Infrastructure", "Rural Development"].map((sec) => {
                      const isSel = profile.preferences.sectors.includes(sec);
                      return (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => togglePrefSector(sec)}
                          className={cn(
                            "rounded px-2 py-0.5 border transition",
                            isSel ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-surface border-ink-100 text-ink-500"
                          )}
                        >
                          {sec}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 border-t border-ink-100 pt-3">
                  <span className="font-bold text-ink-500 block uppercase">Districts (Jharkhand)</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {DISTRICTS_LIST.map((dist) => {
                      const isSel = profile.preferences.districts.includes(dist);
                      return (
                        <button
                          key={dist}
                          type="button"
                          onClick={() => togglePrefDistrict(dist)}
                          className={cn(
                            "rounded px-2 py-0.5 border transition",
                            isSel ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-surface border-ink-100 text-ink-500"
                          )}
                        >
                          {dist}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-teal-600 py-3 text-xs font-bold text-white hover:bg-teal-700 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Save className="h-4 w-4" /> Save Profile Matrix
            </button>
          </div>
        </form>
      ) : (
        /* View Mode: displays ALL fields collected during registration */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Info Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info panel */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Basic Corporate Information
              </h3>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 text-xs text-ink-600">
                <p className="col-span-2 leading-relaxed text-ink-700 italic">"{profile.company.description}"</p>
                <p><span className="font-semibold text-ink-800">Company Type:</span> {profile.company.companyType}</p>
                <p><span className="font-semibold text-ink-800">Company Size:</span> {profile.company.companySize}</p>
                <p><span className="font-semibold text-ink-800">Official Website:</span> <a href={profile.company.website} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">{profile.company.website}</a></p>
                <p><span className="font-semibold text-ink-800">Corporate Email:</span> {profile.company.email}</p>
                <p><span className="font-semibold text-ink-800">Corporate Phone:</span> {profile.company.phone}</p>
                <p><span className="font-semibold text-ink-800">Location Address:</span> {profile.company.address}, {profile.company.city}, {profile.company.state}</p>
              </div>
            </div>

            {/* Expertise panel */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Expertise & Capabilities
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-ink-500 block uppercase mb-1.5">Technologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.expertise.technologies.map((t) => (
                      <span key={t} className="bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded text-[10px] font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-ink-500 block uppercase mb-1.5">Domains Expertise</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.expertise.domains.map((d) => (
                      <span key={d} className="bg-ink-100 border border-ink-200 px-2 py-0.5 rounded text-[10px] font-medium text-ink-700">{d}</span>
                    ))}
                  </div>
                </div>
                {profile.expertise.customCapabilities.length > 0 && (
                  <div>
                    <span className="font-bold text-ink-500 block uppercase mb-1.5">Custom Capabilities</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.expertise.customCapabilities.map((cc) => (
                        <span key={cc} className="bg-ink-50 border border-ink-100 px-2 py-0.5 rounded text-[10px] text-ink-600">{cc}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Support capabilities panel */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider border-b border-ink-100 pb-2">
                Support Capabilities
              </h3>
              <div className="space-y-3.5 text-xs text-ink-600">
                <p>
                  <span className="font-semibold text-ink-800">Support Offerings:</span> {profile.support.capabilities.join(", ") || "None"}
                </p>
                {profile.support.capabilities.includes("Funding") && (
                  <p>
                    <span className="font-semibold text-ink-800">Committed CSR Budget:</span> ₹{profile.support.fundingRange?.min.toLocaleString()} - ₹{profile.support.fundingRange?.max.toLocaleString()} per project
                  </p>
                )}
                {profile.support.capabilities.includes("Technical Mentorship") && (
                  <p>
                    <span className="font-semibold text-ink-800">Mentorship Hours:</span> {profile.support.mentorshipHours}h / month ({profile.support.mentorCount} available mentors)
                  </p>
                )}
              </div>
            </div>

            {/* Experience records panel */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Experience & Previous Collaborations
              </h3>
              
              <div className="space-y-4 text-xs">
                {Object.entries(profile.experience).map(([key, list]: [string, any[]]) => {
                  if (list.length === 0) return null;
                  return (
                    <div key={key} className="space-y-2">
                      <span className="font-bold text-ink-500 uppercase text-[10px] block border-b border-ink-100 pb-1">{key}</span>
                      {list.map((rec, i) => (
                        <div key={i} className="border border-ink-100 p-3.5 rounded bg-surface-alt space-y-1">
                          <p className="font-bold text-ink-900">{rec.title} ({rec.year})</p>
                          <p className="text-ink-500">{rec.description}</p>
                          <p className="text-teal-700 font-semibold text-[10px] mt-1.5">Outcome achieved: {rec.impact}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preferences and Verification Side columns */}
          <div className="space-y-5">
            {/* Matching preferences */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Matching Preferences
              </h3>
              <div className="space-y-3.5 text-xs text-ink-600">
                <div>
                  <span className="font-bold text-ink-400 uppercase text-[9px] block">Project Stages</span>
                  <p className="font-semibold text-ink-900 mt-0.5">{profile.preferences.projectStages.join(", ") || "None"}</p>
                </div>
                <div>
                  <span className="font-bold text-ink-400 uppercase text-[9px] block">Sectors Aligned</span>
                  <p className="font-semibold text-ink-900 mt-0.5">{profile.preferences.sectors.join(", ") || "None"}</p>
                </div>
                <div>
                  <span className="font-bold text-ink-400 uppercase text-[9px] block">Jharkhand Districts Focus</span>
                  <p className="font-semibold text-ink-900 mt-0.5">{profile.preferences.districts.join(", ") || "None"}</p>
                </div>
              </div>
            </div>

            {/* Verification document status */}
            <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider border-b border-ink-100 pb-2">
                Verification Credentials
              </h3>
              <div className="space-y-3.5 text-xs text-ink-600">
                <div>
                  <span className="font-bold text-ink-400 uppercase text-[9px] block">Verification Status</span>
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200 mt-1 inline-block uppercase">
                    {profile.verification.status}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-ink-400 uppercase text-[9px] block">CIN / Org Registration</span>
                  <p className="font-mono text-ink-900 mt-0.5 font-bold">{profile.verification.registrationNumber || "Unprovided"}</p>
                </div>
                <div>
                  <span className="font-bold text-ink-400 uppercase text-[9px] block">GSTIN</span>
                  <p className="font-mono text-ink-900 mt-0.5 font-bold">{profile.verification.gstin || "Unprovided"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
