import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Mic, Type, FileUp, Loader2 } from "lucide-react";
import type { Category, EvidenceFile, GeoLocation, Priority } from "../types";
import UploadZone from "../components/report/UploadZone";
import VoiceRecorder from "../components/report/VoiceRecorder";
import LocationPicker from "../components/report/LocationPicker";
import AIAnalysisCard from "../components/report/AIAnalysisCard";
import { cn } from "../lib/utils";
import { useToast } from "../components/shared/Toast";

const CATEGORIES: Category[] = [
  "Water Management",
  "Roads & Infrastructure",
  "Electricity",
  "Sanitation",
  "Healthcare",
  "Education",
  "Public Safety",
  "Environment",
];

const SUBCATEGORIES: Record<Category, string[]> = {
  "Water Management": ["Drinking Water", "Irrigation", "Flooding", "Water Quality"],
  "Roads & Infrastructure": ["Road Damage", "Bridges", "Public Buildings", "Drainage"],
  Electricity: ["Power Outage", "Faulty Wiring", "Streetlights", "Billing"],
  Sanitation: ["Waste Collection", "Sewage", "Public Toilets", "Open Defecation"],
  Healthcare: ["Staffing", "Medicine Shortage", "Facility Condition", "Ambulance Access"],
  Education: ["Infrastructure", "Staffing", "Mid-day Meals", "Enrolment"],
  "Public Safety": ["Street Lighting", "Crime", "Traffic", "Encroachment"],
  Environment: ["Illegal Dumping", "Deforestation", "Pollution", "Water Bodies"],
};

const URGENCY: Priority[] = ["Low", "Medium", "High", "Critical"];

type Step = "form" | "analysis" | "submitted";

export default function ReportProblem() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [inputMode, setInputMode] = useState<"type" | "voice" | "document">("type");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Water Management");
  const [subcategory, setSubcategory] = useState(SUBCATEGORIES["Water Management"][0]);
  const [urgency, setUrgency] = useState<Priority>("Medium");
  const [affectedPopulation, setAffectedPopulation] = useState("");

  const handleDocumentUpload = (file: File) => {
    setIsExtracting(true);
    setExtractionProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setExtractionProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // Detect type
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        let docType: EvidenceFile["type"] = "document";
        if (["jpg", "jpeg", "png", "webp", "heic"].includes(ext) || file.type.startsWith("image/")) {
          docType = "image";
        } else if (["mp4", "mov", "webm", "mp3", "wav", "m4a", "ogg"].includes(ext) || file.type.startsWith("audio/") || file.type.startsWith("video/")) {
          docType = "video";
        }

        const evidenceFile: EvidenceFile = {
          id: `${file.name}-${Date.now()}`,
          name: file.name,
          type: docType,
          sizeLabel: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadProgress: 100,
        };
        
        setFiles((prev) => [...prev, evidenceFile]);

        if (docType === "image") {
          setTitle("Pavement damage on main street");
          setDescription("AI Extracted Content (Image OCR):\nSeverely damaged road surface with multiple wide potholes measuring over 15cm in depth. The damage extends for about 50 meters, causing two-wheelers to skid and heavy traffic congestion during office hours.");
          setCategory("Roads & Infrastructure");
          setSubcategory(SUBCATEGORIES["Roads & Infrastructure"][0]);
        } else if (file.type.startsWith("audio/") || ["mp3", "wav", "m4a", "ogg"].includes(ext)) {
          setTitle("Water supply valve leakage");
          setDescription("AI Extracted Content (Audio Transcript):\nHi, I want to report a broken water supply line on Kanke Road. Water has been continuously gushing out for the last 24 hours, flooding the local street and reducing water pressure in the nearby houses. Please fix this valve as soon as possible.");
          setCategory("Water Management");
          setSubcategory(SUBCATEGORIES["Water Management"][0]);
        } else if (ext === "pdf" || file.type === "application/pdf") {
          setTitle("Broken streetlights creating dark stretch");
          setDescription("AI Extracted Content (PDF Parser):\nFormal complaint regarding non-functional street lamps along the Circular Road area. Out of 10 lamps, 8 are completely burnt out. The darkness poses safety concerns for pedestrians, particularly women and children, returning late in the evenings.");
          setCategory("Public Safety");
          setSubcategory(SUBCATEGORIES["Public Safety"][0]);
        } else {
          setTitle("Overflowing garbage bin in market area");
          setDescription("AI Extracted Content (Document Parser):\nCivic notice regarding overflowing community garbage containers near Hinoo vegetable market. Waste is spilling onto the roadway, attracting stray animals and generating a hazardous, foul smell.");
          setCategory("Sanitation");
          setSubcategory(SUBCATEGORIES["Sanitation"][0]);
        }

        setIsExtracting(false);
        showToast(`Document "${file.name}" analyzed and details extracted!`, "success");
      }
    }, 250);
  };

  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [location, setLocation] = useState<GeoLocation>({
    district: "Ranchi",
    block: "",
    villageOrTown: "",
    address: "",
    latitude: 23.3441,
    longitude: 85.3096,
  });

  const [complaintId] = useState(
    `JH-${category.slice(0, 3).toUpperCase()}-2026-${String(Math.floor(1000 + Math.random() * 8999))}`
  );

  function addFiles(newFiles: EvidenceFile[]) {
    setFiles((prev) => {
      const ids = new Set(prev.map((f) => f.id));
      const updates = newFiles.filter((f) => ids.has(f.id));
      const additions = newFiles.filter((f) => !ids.has(f.id));
      const merged = prev.map((f) => updates.find((u) => u.id === f.id) ?? f);
      return [...merged, ...additions];
    });
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const canContinue = title.trim().length > 3 && description.trim().length > 10;

  if (step === "submitted") {
    return (
      <div className="mx-auto max-w-lg rounded-card border border-ink-100 bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-ink-900">Problem reported successfully</h2>
        <p className="mt-2 text-sm text-ink-500">Your complaint ID is</p>
        <p className="mt-1 font-mono text-xl font-semibold text-teal-700">{complaintId}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded bg-amber-100 px-3 py-1 text-xs font-medium text-amber-600">
          Status: Under Review
        </div>
        <p className="mt-5 text-sm text-ink-500">
          We'll send important status updates to your registered mobile number by SMS, and you can always
          track progress from My Complaints.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(`/citizen/complaints/${complaintId}`)}
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Track this complaint
          </button>
          <button
            onClick={() => navigate("/citizen/dashboard")}
            className="rounded border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-surface-sunken"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === "analysis") {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold text-ink-900">Review AI analysis</h2>
        <p className="text-sm text-ink-500">
          Our system has read your report and pre-filled these details for the reviewing authority. You can go
          back and edit anything before submitting.
        </p>
        <AIAnalysisCard
          analysis={{
            category,
            subcategory,
            priority: urgency,
            affectedPopulationEstimate: Number(affectedPopulation) || 1200,
            keywords: description
              .toLowerCase()
              .split(/\s+/)
              .filter((w) => w.length > 5)
              .slice(0, 4),
            similarReports:
              category === "Water Management"
                ? [{ id: "JH-WTR-2026-001790", title: "Water shortage in XYZ Village", similarity: 92, relatedReportCount: 17 }]
                : [],
          }}
          onContinue={() => {
            showToast(`Complaint ${complaintId} submitted and set to Under Review.`, "success");
            setStep("submitted");
          }}
        />
        <button onClick={() => setStep("form")} className="text-sm font-medium text-ink-500 hover:text-ink-800">
          ← Back to edit
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-ink-900">Report a problem</h2>
        <p className="text-sm text-ink-500">
          Describe the issue in your own words or by voice. The more detail you give, the faster it can be
          validated.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-card border border-ink-200 bg-surface-alt p-1 w-fit">
          <button
            type="button"
            onClick={() => setInputMode("type")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition cursor-pointer",
              inputMode === "type" ? "bg-surface shadow-sm text-ink-900" : "text-ink-500"
            )}
          >
            <Type className="h-4 w-4" /> Type
          </button>
          <button
            type="button"
            onClick={() => setInputMode("voice")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition cursor-pointer",
              inputMode === "voice" ? "bg-surface shadow-sm text-ink-900" : "text-ink-500"
            )}
          >
            <Mic className="h-4 w-4" /> Voice
          </button>
          <button
            type="button"
            onClick={() => setInputMode("document")}
            className={cn(
              "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition cursor-pointer",
              inputMode === "document" ? "bg-surface shadow-sm text-ink-900" : "text-ink-500"
            )}
          >
            <FileUp className="h-4 w-4" /> Document
          </button>
        </div>

        {inputMode === "voice" && (
          <VoiceRecorder onTranscript={(text) => setDescription((prev) => (prev ? `${prev} ${text}` : text))} />
        )}

        {inputMode === "document" && (
          <div className="rounded-card border border-ink-200 bg-surface p-6 text-center space-y-4">
            {isExtracting ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                <p className="text-sm font-semibold text-ink-900">AI extraction in progress...</p>
                <div className="w-full max-w-xs bg-ink-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${extractionProgress}%` }}
                  />
                </div>
                <p className="text-xs text-ink-500">{extractionProgress}% parsed</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <FileUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900">Upload a report or media document</p>
                  <p className="text-xs text-ink-500 mt-1">Supports Audio, Image, PDF, Word documents</p>
                </div>
                <label className="cursor-pointer rounded border border-ink-200 bg-surface px-4 py-2 text-sm font-medium text-ink-700 hover:bg-surface-sunken inline-block">
                  Select Document
                  <input
                    type="file"
                    className="hidden"
                    accept="audio/*,image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDocumentUpload(file);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-800">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Water shortage in Kanke Road borewell cluster"
            className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-800">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what's happening, since when, and who is affected..."
            className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-800">Category</label>
            <select
              value={category}
              onChange={(e) => {
                const c = e.target.value as Category;
                setCategory(c);
                setSubcategory(SUBCATEGORIES[c][0]);
              }}
              className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-800">Subcategory</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            >
              {SUBCATEGORIES[category].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-800">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as Priority)}
              className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            >
              {URGENCY.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-800">Affected population (approx.)</label>
            <input
              type="number"
              value={affectedPopulation}
              onChange={(e) => setAffectedPopulation(e.target.value)}
              placeholder="e.g. 1200"
              className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-ink-900">Evidence</h3>
        <UploadZone files={files} onAdd={addFiles} onRemove={removeFile} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-ink-900">Location</h3>
        <LocationPicker location={location} onChange={setLocation} />
      </section>

      <div className="flex justify-end border-t border-ink-100 pt-5">
        <button
          disabled={!canContinue}
          onClick={() => setStep("analysis")}
          className="rounded bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue to AI analysis
        </button>
      </div>
    </div>
  );
}
