import { useRef, useState } from "react";
import { Camera, FileUp, UploadCloud } from "lucide-react";
import { cn } from "../../lib/utils";
import type { EvidenceFile } from "../../types";
import MediaPreview from "./MediaPreview";

interface UploadZoneProps {
  files: EvidenceFile[];
  onAdd: (files: EvidenceFile[]) => void;
  onRemove: (id: string) => void;
}

function detectType(name: string): EvidenceFile["type"] {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "webp", "heic"].includes(ext)) return "image";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  return "document";
}

function toEvidence(fileList: FileList): EvidenceFile[] {
  return Array.from(fileList).map((f) => ({
    id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: f.name,
    type: detectType(f.name),
    sizeLabel: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
    uploadProgress: 0,
  }));
}

export default function UploadZone({ files, onAdd, onRemove }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  function simulateUpload(newFiles: EvidenceFile[]) {
    onAdd(newFiles.map((f) => ({ ...f, uploadProgress: 10 })));
    newFiles.forEach((f) => {
      let progress = 10;
      const interval = setInterval(() => {
        progress += 20 + Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        onAdd([{ ...f, uploadProgress: progress }]);
      }, 350);
    });
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    simulateUpload(toEvidence(fileList));
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "hidden flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 py-10 text-center transition sm:flex",
          dragOver ? "border-teal-500 bg-teal-50" : "border-ink-200 bg-surface-alt"
        )}
      >
        <UploadCloud className="h-8 w-8 text-ink-400" strokeWidth={1.5} />
        <p className="text-sm font-medium text-ink-700">Drag and drop photos, videos or documents</p>
        <p className="text-xs text-ink-400">or</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded border border-ink-200 bg-surface px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-surface-sunken"
        >
          Browse files
        </button>
      </div>

      <div className="flex gap-2 sm:hidden">
        <button
          onClick={() => cameraRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-card border border-ink-200 bg-surface-alt px-4 py-3 text-sm font-medium text-ink-700"
        >
          <Camera className="h-4 w-4" /> Camera
        </button>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex flex-1 items-center justify-center gap-2 rounded-card border border-ink-200 bg-surface-alt px-4 py-3 text-sm font-medium text-ink-700"
        >
          <FileUp className="h-4 w-4" /> Files
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        accept="image/*,video/*,.pdf,.doc,.docx"
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f) => (
            <MediaPreview key={f.id} file={f} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
