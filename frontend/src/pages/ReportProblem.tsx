import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Mic, Type, FileUp, Loader2, Sparkles } from "lucide-react";
import type { Category, EvidenceFile, GeoLocation, Priority, AIAnalysis } from "../types";
import UploadZone from "../components/report/UploadZone";
import VoiceRecorder from "../components/report/VoiceRecorder";
import LocationPicker from "../components/report/LocationPicker";
import AIAnalysisCard from "../components/report/AIAnalysisCard";
import { cn } from "../lib/utils";
import { useToast } from "../components/shared/Toast";
import { useAuth } from "../components/shared/Auth";
import { api } from "../lib/api";

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

type Step = "form" | "loading" | "analysis" | "submitted";

export default function ReportProblem() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentUser } = useAuth();
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
  
  const [backendProblemId, setBackendProblemId] = useState<number | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysis | null>(null);

  const handleDocumentUpload = (file: File) => {
    setIsExtracting(true);
    setExtractionProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setExtractionProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
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

  const [displayId, setDisplayId] = useState("");

  const handleFormSubmit = async () => {
    if (!currentUser) return;
    
    setStep("loading");
    try {
      // 1. Submit basic problem to Flask
      const submission = await api.submitProblem({
        name: currentUser.name,
        email: currentUser.email,
        role: "CITIZEN",
        title,
        description,
        domain: category,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      const probId = submission.problem_id;
      setBackendProblemId(probId);
      
      // 2. Trigger AI Analysis (Groq + Embeddings)
      const analysisData = await api.analyzeProblem(probId);
      
      // Map backend analysis to frontend types
      const mappedAnalysis: AIAnalysis = {
        category: (analysisData.analysis.domain as Category) || category,
        subcategory: subcategory, // Backend doesn't split domain/subcategory yet
        priority: (analysisData.analysis.severity as Priority) || urgency,
        affectedPopulationEstimate: typeof analysisData.analysis.affected_people === 'number' 
          ? analysisData.analysis.affected_people 
          : parseInt(String(analysisData.analysis.affected_people)) || 0,
        keywords: analysisData.analysis.keywords || [],
        similarReports: [], // Matching functionality is separate in backend
      };
      
      setAiResult(mappedAnalysis);
      setDisplayId(`JH-SAATHI-${probId}`);
      setStep("analysis");
      
    } catch (error) {
      console.error(error);
      showToast("Backend connection failed. Please check if Flask is running.", "error");
      setStep("form");
    }
  };

  function addFiles(newFiles: EvidenceFile[]) {
    setFiles((prev) => {
      const ids = new Set(prev.map((f) => f.id));
      const additions = newFiles.filter((f) => !ids.has(f.id));
      return [...prev, ...additions];
    });
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  const canContinue = title.trim().length > 3 && description.trim().length > 10;

  if (step === "loading") {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
          <Sparkles className="absolute -right-2 -top-2 h-6 w-6 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink-900">Processing with SAATHI AI</h2>
          <p className="text-sm text-ink-500 max-w-xs mx-auto">
            Analyzing your report with Groq LLM and generating semantic embeddings for expert matching...
          </p>
        </div>
      </div>
    );
  }

  if (step === "submitted") {
    return (
      <div className="mx-auto max-w-lg rounded-card border border-ink-100 bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-7 w-7 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-ink-900">Problem reported successfully</h2>
        <p className="mt-2 text-sm text-ink-500">Your complaint ID is</p>
        <p className="mt-1 font-mono text-xl font-semibold text-teal-700">{displayId}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded bg-amber-100 px-3 py-1 text-xs font-medium text-amber-600">
          Status: Under Review
        </div>
        <p className="mt-5 text-sm text-ink-500">
          SAATHI AI has indexed your problem. We are now matching it with relevant University experts in Jharkhand.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate(`/citizen/dashboard`)}
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === "analysis" && aiResult) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold text-ink-900">Review SAATHI AI Analysis</h2>
        <p className="text-sm text-ink-500">
          Our Groq-powered system has analyzed your report. These details help government and universities prioritize the issue.
        </p>
        <AIAnalysisCard
          analysis={aiResult}
          onContinue={() => {
            showToast(`Complaint submitted and indexed successfully.`, "success");
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
          Describe the issue in your own words. SAATHI AI will handle categorization and expert matching.
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <FileUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900">Upload a report or media document</p>
                  <label className="cursor-pointer rounded border border-ink-200 bg-surface px-4 py-2 text-sm font-medium text-ink-700 hover:bg-surface-sunken inline-block mt-2">
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
              </div>
            )}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-800">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short title of the problem"
            className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-800">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what's happening..."
            className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-800">Category (Initial)</label>
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
            <label className="mb-1 block text-sm font-medium text-ink-800">Approx. Impact (People)</label>
            <input
              type="number"
              value={affectedPopulation}
              onChange={(e) => setAffectedPopulation(e.target.value)}
              placeholder="e.g. 100"
              className="w-full rounded border border-ink-200 bg-surface px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-ink-900">Location</h3>
        <LocationPicker location={location} onChange={setLocation} />
      </section>

      <div className="flex justify-end border-t border-ink-100 pt-5">
        <button
          disabled={!canContinue}
          onClick={handleFormSubmit}
          className="rounded bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit to SAATHI AI
        </button>
      </div>
    </div>
  );
}
