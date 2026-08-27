import { MessageSquareText } from "lucide-react";
import { formatDateTime } from "../../lib/utils";

export default function SMSNotificationCard({ message, timestamp }: { message: string; timestamp: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-card border border-ink-100 bg-surface-alt p-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-800">
        <MessageSquareText className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-ink-700">{message}</p>
        <p className="mt-1 text-[11px] text-ink-400">SMS · {formatDateTime(timestamp)}</p>
      </div>
    </div>
  );
}
