import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Play, RotateCcw, Square, Trash2, Wand2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { api } from "../../lib/api";
import { useToast } from "../shared/Toast";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

const BAR_COUNT = 28;

export default function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const { showToast } = useToast();
  const [status, setStatus] = useState<"idle" | "recording" | "recorded" | "playing">("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Prefer WAV if supported, otherwise let the browser decide
      const mimeType = MediaRecorder.isTypeSupported('audio/wav') ? 'audio/wav' : 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setStatus("recorded");
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setSeconds(0);
      setStatus("recording");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      showToast("Could not access microphone. Please check permissions.", "warning");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && status === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  function reRecord() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setSeconds(0);
    setStatus("idle");
    startRecording();
  }

  function deleteRecording() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setSeconds(0);
    setStatus("idle");
  }

  function togglePlay() {
    if (!audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setStatus("recorded");
    }

    if (status === "playing") {
      audioRef.current.pause();
      setStatus("recorded");
    } else {
      audioRef.current.play();
      setStatus("playing");
    }
  }

  async function transcribe() {
    if (!audioBlob) return;
    
    setTranscribing(true);
    try {
      // Determine extension based on blob type
      const ext = audioBlob.type.includes('wav') ? 'wav' : 'webm';
      const result = await api.parseInput(audioBlob, `recording.${ext}`);
      
      onTranscript(result.text);
      showToast("Transcription successful!", "success");
    } catch (error: any) {
      console.error("Transcription error:", error);
      showToast(error.message || "Failed to transcribe audio.", "warning");
    } finally {
      setTranscribing(false);
    }
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
