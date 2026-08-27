import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "../../lib/utils";

type ToastVariant = "success" | "info" | "warning";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
};

const STYLES: Record<ToastVariant, string> = {
  success: "border-green-600/30 text-green-600",
  info: "border-blue-600/30 text-blue-600",
  warning: "border-amber-600/30 text-amber-600",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.variant];
          return (
            <div
              key={t.id}
              className={cn(
                "animate-fade-in flex items-start gap-2.5 rounded-card border bg-surface px-4 py-3 shadow-lg",
                STYLES[t.variant]
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="flex-1 text-sm text-ink-800">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-ink-400 hover:text-ink-700">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
