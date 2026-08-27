import { FileText, Film, ImageIcon, X } from "lucide-react";
import type { EvidenceFile } from "../../types";

const ICONS = { image: ImageIcon, video: Film, document: FileText };

export default function MediaPreview({
  file,
  onRemove,
}: {
  file: EvidenceFile;
  onRemove: (id: string) => void;
}) {
  const Icon = ICONS[file.type];
  return (
    <div className="flex items-center gap-3 rounded border border-ink-200 bg-surface p-2.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-sunken">
        <Icon className="h-5 w-5 text-ink-500" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-800">{file.name}</p>
        <p className="text-xs text-ink-400">{file.sizeLabel}</p>
        {file.uploadProgress < 100 && (
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div
              className="h-full rounded-full bg-teal-500 transition-all"
              style={{ width: `${file.uploadProgress}%` }}
            />
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(file.id)}
        className="rounded p-1.5 text-ink-400 hover:bg-red-100 hover:text-red-600"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
