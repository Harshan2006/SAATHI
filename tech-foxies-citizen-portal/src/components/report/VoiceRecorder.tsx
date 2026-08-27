import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, RotateCcw, Square, Trash2, Wand2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

const MOCK_TRANSCRIPT =
  "There has been no water supply from the borewell near our locality for the past four days. Around two hundred families are affected and we have to walk far to fetch water.";

const BAR_COUNT = 28;

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const [status, setStatus] = useState<"idle" | "recording" | "recorded" | "playing">("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "recording") {
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [status]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  function startRecording() {
    setSeconds(0);
    setStatus("recording");
  }

  function stopRecording() {
    setStatus("recorded");
  }

  function reRecord() {
    setSeconds(0);
    setStatus("idle");
  }

  function deleteRecording() {
    setSeconds(0);
    setStatus("idle");
  }

  function togglePlay() {
    setStatus((s) => (s === "playing" ? "recorded" : "playing"));
  }

  function transcribe() {
    setTranscribing(true);
    setTimeout(() => {
      onTranscript(MOCK_TRANSCRIPT);
      setTranscribing(false);
    }, 1200);
  }

  return (
    <div className="rounded-card border border-ink-200 bg-surface-alt p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-700">Voice description</p>
        <span className="font-mono text-xs text-ink-500">{mm}:{ss}</span>
      </div>

      <div className="mt-3 flex h-14 items-end justify-center gap-[3px] rounded bg-surface px-3">
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const height = 20 + ((i * 37) % 70);
          return (
            <span
              key={i}
              className={cn(
                "w-1 rounded-full bg-teal-500/70",
                status === "recording" || status === "playing" ? "wave-bar" : ""
              )}
              style={{
                height: status === "idle" ? "6px" : `${height}%`,
                animationDelay: `${i * 40}ms`,
                opacity: status === "idle" ? 0.3 : 1,
              }}
            />
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {status === "idle" && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Mic className="h-4 w-4" /> Start recording
          </button>
        )}

        {status === "recording" && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-600/90"
          >
            <Square className="h-4 w-4" /> Stop
          </button>
        )}

        {(status === "recorded" || status === "playing") && (
          <>
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 rounded border border-ink-200 bg-surface px-3 py-2 text-sm font-medium text-ink-700 hover:bg-surface-sunken"
            >
              {status === "playing" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {status === "playing" ? "Pause" : "Play"}
            </button>
            <button
              onClick={reRecord}
              className="flex items-center gap-1.5 rounded border border-ink-200 bg-surface px-3 py-2 text-sm font-medium text-ink-700 hover:bg-surface-sunken"
            >
              <RotateCcw className="h-4 w-4" /> Re-record
            </button>
            <button
              onClick={deleteRecording}
              className="flex items-center gap-1.5 rounded border border-red-600/30 bg-surface px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
            <button
              onClick={transcribe}
              disabled={transcribing}
              className="flex items-center gap-1.5 rounded bg-ink-900 px-3 py-2 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-60"
            >
              <Wand2 className="h-4 w-4" /> {transcribing ? "Transcribing..." : "Convert to text"}
            </button>
          </>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-ink-400">
        Recording works on mobile and desktop. Converted text is added to the description field below.
      </p>
    </div>
  );
}
