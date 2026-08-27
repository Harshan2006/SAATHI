import { useRef, useState } from "react";
import { Camera, FileUp, UploadCloud, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import type { EvidenceFile } from "../../types";
import MediaPreview from "./MediaPreview";
import { api } from "../../lib/api";
import { useToast } from "../shared/Toast";

interface UploadZoneProps {
  files: EvidenceFile[];
  onAdd: (files: EvidenceFile[]) => void;
  onRemove: (id: string) => void;
  onParse?: (text: string) => void;
}

function detectType(name: string): EvidenceFile["type"] {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "webp", "heic", "bmp", "tiff", "tif"].includes(ext)) return "image";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  return "document";
}

export default function UploadZone({ files, onAdd, onRemove, onParse }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    const newFiles: EvidenceFile[] = Array.from(fileList).map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      type: detectType(f.name),
      sizeLabel: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadProgress: 0,
    }));

    onAdd(newFiles);

    // Process files for extraction if supported
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const type = detectType(file.name);
      
      // Update progress to simulate upload for UI
      onAdd([{ ...newFiles[i], uploadProgress: 100 }]);

      // If it's a document or image, try to extract text
      if ((type === "document" || type === "image") && onParse) {
        setIsParsing(true);
        try {
          const result = await api.parseInput(file, file.name);
          if (result.text) {
            onParse(result.text);
            showToast(`Content extracted from ${file.name}`, "info");
          }
        } catch (err) {
          console.error(`Failed to parse ${file.name}:`, err);
        } finally {
          setIsParsing(false);
        }
      }
    }
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
        {isParsing ? (
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        ) : (
          <UploadCloud className="h-8 w-8 text-ink-400" strokeWidth={1.5} />
        )}
        <p className="text-sm font-medium text-ink-700">
          {isParsing ? "AI is reading your evidence..." : "Drag and drop photos or documents"}
        </p>
        <p className="text-xs text-ink-400">Supported: PDF, Docx, TXT, XLSX, Image (OCR), Audio</p>
        <button
          disabled={isParsing}
          onClick={() => inputRef.current?.click()}
          className="mt-2 rounded border border-ink-200 bg-surface px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-surface-sunken disabled:opacity-50"
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
        accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.xlsx,.xls,.csv,.pptx,image/*,audio/*"
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
