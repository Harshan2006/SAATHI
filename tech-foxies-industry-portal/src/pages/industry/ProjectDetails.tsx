import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Building,
  Sparkles,
  AlertTriangle,
  FolderDot,
  Wrench,
  User,
  FileCheck,
  X,
  Layers,
  ChevronRight,
  Handshake,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { industryProjects } from "../../data/industryMockData";
import { useToast } from "../../components/shared/Toast";
import { getIndustryProfile, calculateProjectMatch } from "../../store/industryStore";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  
  const profile = getIndustryProfile();
  const project = industryProjects.find((p) => p.id === id) || industryProjects[0];
  const match = calculateProjectMatch(profile, project);

  const [activeTab, setActiveTab] = useState<"problem" | "solution" | "university" | "progress">("problem");
  const [modalOpen, setModalOpen] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  // Form states for collaboration modal
  const [contributions, setContributions] = useState<string[]>([]);
  const [fundingAmount, setFundingAmount] = useState("");
  const [expertise, setExpertise] = useState("");
  const [techOffered, setTechOffered] = useState("");
  const [message, setMessage] = useState("");
  const [timeline, setTimeline] = useState("");

  const toggleContribution = (val: string) => {
    if (contributions.includes(val)) {
      setContributions(contributions.filter((c) => c !== val));
    } else {
      setContributions([...contributions, val]);
    }
  };

  const handleCollaborationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contributions.length === 0) {
      showToast("Please select at least one contribution type.", "warning");
      return;
    }
    setInterestSubmitted(true);
    showToast("Collaboration request sent to the university!", "success");
  };

  const resetModal = () => {
    setModalOpen(false);
    setInterestSubmitted(false);
    setContributions([]);
    setFundingAmount("");
    setExpertise("");
    setTechOffered("");
    setMessage("");
    setTimeline("");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs text-ink-500">
        <Link to="/projects" className="hover:underline">Discover Projects</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-ink-700">{project.id}</span>
      </div>

      {/* Header Profile */}
      <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-ink-400 uppercase">
              <span>{project.id}</span>
              <span>•</span>
              <span>{project.category}</span>
            </div>
            <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">{project.title}</h2>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-500 mt-1">
              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {project.location.address}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><Building className="h-3 w-3" /> {project.universityName}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded text-xs font-bold text-teal-700 h-fit">
              <Sparkles className="h-4 w-4" />
              <span>{match.matchScore}% Match</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-ink-900 text-white px-3 py-1 text-xs font-bold h-fit uppercase">
              {project.status}
            </span>
          </div>
        </div>

        {/* Requirements quickview & Action buttons */}
        <div className="flex flex-col gap-4 border-t border-ink-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-ink-600">
            Required industry support:{" "}
            <span className="font-bold text-teal-700">
              {project.requiredSupport.join(", ")}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="rounded bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition flex items-center gap-1 cursor-pointer"
            >
              <Handshake className="h-4 w-4" /> Express Interest
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink-200">
        {[
          { id: "problem", label: "Community Problem", icon: AlertTriangle },
          { id: "solution", label: "Proposed Solution", icon: Wrench },
          { id: "university", label: "University & Team", icon: User },
          { id: "progress", label: "Timeline & Progress", icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-semibold transition cursor-pointer -mb-px",
              activeTab === tab.id
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-ink-500 hover:text-ink-700"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm">
        {activeTab === "problem" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink-955 uppercase tracking-wider">Societal Problem Statement</h3>
              <p className="mt-2 text-sm text-ink-700 leading-relaxed">{project.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-ink-100 pt-4 sm:grid-cols-3">
              <div className="space-y-1">
                <span className="text-xs text-ink-400 block font-semibold uppercase">Beneficiary District</span>
                <p className="text-xs font-medium text-ink-800">{project.location.district} District, Jharkhand</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-ink-400 block font-semibold uppercase">Affected Population</span>
                <p className="text-xs font-medium text-ink-800">{project.affectedPopulation.toLocaleString()} residents</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-ink-400 block font-semibold uppercase">Validation Priority</span>
                <p className="text-xs font-medium text-red-600 font-bold">{project.urgency}</p>
              </div>
            </div>

            {project.evidence.length > 0 && (
              <div className="border-t border-ink-100 pt-4 space-y-2">
                <h4 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Citizen Attached Evidence</h4>
                <div className="flex flex-wrap gap-2">
                  {project.evidence.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 rounded border border-ink-200 bg-surface-alt px-3 py-1.5 text-xs text-ink-700"
                    >
                      <FolderDot className="h-4 w-4 text-ink-400" />
                      <span className="font-medium truncate max-w-[150px]">{file.name}</span>
                      <span className="text-[10px] text-ink-400">({file.sizeLabel})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "solution" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink-955 uppercase tracking-wider">Proposed University Solution</h3>
              <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                Development of low-power sensor micro-nodes combined with automated control valves to automate flow distribution mapping. Data is synchronized via low-bandwidth telemetry, giving government officials and researchers a real-time diagnostic dashboard.
              </p>
            </div>

            <div className="border-t border-ink-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Key Technologies Involved</h4>
              <div className="flex flex-wrap gap-2">
                {["Embedded Firmware (C/C++)", "ESP32 microcontrollers", "LoRa / Low-Bandwidth GPRS Telemetry", "Soleneoid distribution valves", "Cloud databases & React Web Panel"].map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-teal-50 border border-teal-100 px-2.5 py-1 text-xs text-teal-700 font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-100 pt-4 space-y-1.5">
              <h4 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Expected Social Outcome</h4>
              <p className="text-xs text-ink-600 leading-relaxed">{project.expectedImpact}</p>
            </div>
          </div>
        )}

        {activeTab === "university" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-ink-100 pb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-700">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink-900">{project.universityName}</h3>
                <p className="text-xs text-ink-500">{project.department}</p>
              </div>
            </div>

            {/* Mentor */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Faculty Project Guide</h4>
              <div className="rounded border border-ink-200 p-3.5 bg-surface-alt flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <p className="font-semibold text-ink-900 text-xs sm:text-sm">{project.facultyMentor.name}</p>
                  <p className="text-xs text-ink-500">{project.facultyMentor.role}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.facultyMentor.expertise.map((exp, i) => (
                      <span key={i} className="text-[10px] bg-ink-200 px-2 py-0.5 rounded text-ink-750 font-medium">{exp}</span>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-teal-600 font-mono mt-2 sm:mt-0">{project.facultyMentor.email}</span>
              </div>
            </div>

            {/* Students */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Active Students Team</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {project.studentTeam.map((stu, i) => (
                  <div key={i} className="rounded border border-ink-100 p-3 bg-surface space-y-1.5">
                    <p className="font-semibold text-ink-900 text-xs">{stu.name}</p>
                    <p className="text-[11px] text-ink-500 font-medium">{stu.role}</p>
                    <div className="text-[10px] text-ink-400">
                      Skills: {stu.skills.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-6 py-2">
            <div>
              <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
                <span className="font-semibold">Development progress timeline</span>
                <span className="font-bold text-teal-700">{project.progress}% completed</span>
              </div>
              <div className="w-full bg-ink-100 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="relative border-l border-ink-200 pl-4 ml-2 space-y-6 text-xs">
              {[
                { stage: "Research Phase", desc: "Initial literature survey, geological maps and community requirements definition.", status: "completed" },
                { stage: "Prototype Design", desc: "Breadboard sensor interfacing, firmware calibrations and watertight enclosure testing.", status: "current" },
                { stage: "Lab & Field Testing", desc: "Local environmental trial runs and testing of telemetry synchronization over 3G/GPRS channels.", status: "upcoming" },
                { stage: "Pilot Deployment", desc: "Setting up 5 fully integrated check nodes in Ranchi Kanke region.", status: "upcoming" },
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[21px] top-0 flex h-3 w-3 items-center justify-center rounded-full border bg-white",
                      step.status === "completed"
                        ? "border-teal-600"
                        : step.status === "current"
                        ? "border-teal-500 ring-2 ring-teal-100"
                        : "border-ink-200"
                    )}
                  >
                    {step.status === "completed" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                    )}
                    {step.status === "current" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
                    )}
                  </span>
                  <div className="space-y-0.5">
                    <span className={cn("font-semibold block", step.status === "completed" ? "text-ink-700" : step.status === "current" ? "text-teal-700" : "text-ink-400")}>
                      {step.stage}
                    </span>
                    <p className="text-ink-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Matching explanation panel */}
      <div className="rounded-card border border-teal-100 bg-teal-50/20 p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-teal-850 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-teal-600" /> Matching Analysis Details
        </h3>
        <p className="text-xs text-teal-800 leading-relaxed">
          The matching score calculation is dynamically generated based on your company profile values:
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
          {match.matchReasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-teal-900">
              <span className="text-teal-600 font-bold">✓</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Collaboration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/50" onClick={resetModal} />
          
          <div className="relative z-10 w-full max-w-lg rounded-card bg-surface p-6 shadow-xl border border-ink-200">
            {/* Close Button */}
            <button
              onClick={resetModal}
              className="absolute right-4 top-4 rounded p-1 text-ink-400 hover:bg-surface-sunken hover:text-ink-600"
            >
              <X className="h-5 w-5" />
            </button>

            {!interestSubmitted ? (
              <form onSubmit={handleCollaborationSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-ink-900 flex items-center gap-1.5">
                    <Handshake className="h-5.5 w-5.5 text-teal-600" /> Collaborate on this Project
                  </h3>
                  <p className="text-xs text-ink-500 mt-1">
                    Select how your company wants to support <span className="font-semibold">{project.universityName}</span>.
                  </p>
                </div>

                {/* Contribution selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-ink-500 uppercase">Select Contribution Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Funding", "Technical Mentorship", "Hardware Devices", "Software Licenses", "Testing Facilities", "Field Deployment"].map((opt) => {
                      const isSel = contributions.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleContribution(opt)}
                          className={cn(
                            "flex items-center gap-2 rounded border px-3 py-2 text-xs font-semibold transition text-left cursor-pointer",
                            isSel
                              ? "border-teal-600 bg-teal-50 text-teal-700"
                              : "border-ink-200 bg-surface text-ink-600 hover:bg-surface-sunken"
                          )}
                        >
                          <input type="checkbox" checked={isSel} readOnly className="pointer-events-none accent-teal-600" />
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {contributions.includes("Funding") && (
                  <div>
                    <label htmlFor="fundingAmount" className="block text-xs font-bold text-ink-500 uppercase mb-1">Proposed Funding Amount (INR)</label>
                    <input
                      id="fundingAmount"
                      type="number"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      placeholder="e.g. 350000"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="expertise" className="block text-xs font-bold text-ink-500 uppercase mb-1">Expertise offered</label>
                    <input
                      id="expertise"
                      type="text"
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                      placeholder="e.g. IoT Power calibrations"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="techOffered" className="block text-xs font-bold text-ink-500 uppercase mb-1">Technology offered</label>
                    <input
                      id="techOffered"
                      type="text"
                      value={techOffered}
                      onChange={(e) => setTechOffered(e.target.value)}
                      placeholder="e.g. LoRa modules, Gateway space"
                      className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-ink-500 uppercase mb-1">Proposal message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Describe how your engineering team will interact with the student developers..."
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-xs font-bold text-ink-500 uppercase mb-1">Support timeline duration</label>
                  <input
                    id="timeline"
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g. 3 months, 6 months"
                    className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition cursor-pointer"
                >
                  Send Collaboration Request
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 border border-green-200">
                  <FileCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-ink-900 text-base sm:text-lg">Request Sent Successfully</h3>
                  <p className="text-xs text-ink-500">
                    Your interest has been submitted. Status: <span className="font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Pending University Review</span>
                  </p>
                </div>
                <p className="text-xs text-ink-600 max-w-sm mx-auto leading-relaxed">
                  We have notified Dr. Alok Vardhan (Civil & Environmental Engineering guide) about your interest. You will receive an in-app alert when the team responds.
                </p>
                <button
                  onClick={resetModal}
                  className="rounded border border-ink-200 px-6 py-1.5 text-xs font-semibold text-ink-700 hover:bg-surface-sunken transition cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
