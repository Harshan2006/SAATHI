import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  widthClass?: string;
}

export default function Modal({ open, onClose, title, children, widthClass = "max-w-lg" }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/50 animate-fade-in" onClick={onClose} />
      <div
        className={`relative z-10 w-full ${widthClass} animate-fade-in rounded-card border border-ink-100 bg-surface shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-ink-400 hover:bg-surface-sunken hover:text-ink-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
