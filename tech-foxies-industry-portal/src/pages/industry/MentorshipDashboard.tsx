import { useState } from "react";
import { GraduationCap, Calendar, Clock, Video, UserCheck, Plus, AlignLeft } from "lucide-react";
import { mentorshipSessions } from "../../data/industryMockData";
import { useToast } from "../../components/shared/Toast";

export default function MentorshipDashboard() {
  const { showToast } = useToast();
  const [sessions, setSessions] = useState(mentorshipSessions);
  const [showScheduler, setShowScheduler] = useState(false);

  // Form states
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [projectSelect, setProjectSelect] = useState("Smart Water Monitoring System");

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.status === "Completed").length;
  const activeStudents = sessions.reduce((sum, s) => sum + s.studentsCount, 0);

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !date || !time) {
      showToast("Please fill in all scheduling fields.", "warning");
      return;
    }

    const newSession = {
      id: `m-sess-new-${Date.now()}`,
      projectId: "JH-WTR-2026-001842",
      projectTitle: projectSelect,
      universityName: "BIT Mesra",
      facultyMentor: "Dr. Alok Vardhan",
      studentsCount: 3,
      mentorName: "Siddharth Sen",
      topic,
      date,
      time,
      status: "Scheduled" as const,
      meetingLink: "https://meet.abctech.in/water-iot",
    };

    setSessions([newSession, ...sessions]);
    setShowScheduler(false);
    setTopic("");
    setDate("");
    setTime("");
    showToast("Mentorship session scheduled and calendar invites sent!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Mentorship Hub</h2>
          <p className="text-sm text-ink-500 mt-1">
            Provide technical mentorship, guide student researchers, and schedule video reviews.
          </p>
        </div>

        <button
          onClick={() => setShowScheduler(true)}
          className="rounded bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Schedule Session
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Mentorships", value: "2 Projects", icon: GraduationCap },
          { label: "Students Guided", value: activeStudents, icon: UserCheck },
          { label: "Sessions Conducted", value: `${completedSessions} / ${totalSessions}`, icon: Calendar },
        ].map((item, i) => (
          <div key={i} className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-ink-500 uppercase tracking-wider block">{item.label}</span>
              <p className="mt-1 text-base sm:text-xl font-bold text-ink-900">{item.value}</p>
            </div>
            <item.icon className="h-6 w-6 text-teal-600 shrink-0" />
          </div>
        ))}
      </div>

      {/* Scheduled Sessions list */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-ink-950 uppercase tracking-wider">Upcoming Sessions</h3>
          
          <div className="space-y-3">
            {sessions
              .filter((s) => s.status === "Scheduled")
              .map((sess) => (
                <div key={sess.id} className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm space-y-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      Scheduled Link Active
                    </span>
                    <h4 className="font-semibold text-ink-900 text-sm mt-2">{sess.topic}</h4>
                    <p className="text-xs text-ink-500 mt-0.5">{sess.projectTitle} • {sess.universityName}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-600 bg-surface-alt rounded p-3 border border-ink-100">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-ink-400" /> {sess.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-ink-400" /> {sess.time}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-ink-100 pt-3">
                    <div className="text-[10px] text-ink-500">
                      With: <span className="font-semibold text-ink-700">{sess.facultyMentor} + team</span>
                    </div>
                    {sess.meetingLink && (
                      <a
                        href={sess.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition flex items-center gap-1"
                      >
                        <Video className="h-3.5 w-3.5" /> Join Room
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Completed Logs</h3>
          
          <div className="space-y-3">
            {sessions
              .filter((s) => s.status === "Completed")
              .map((sess) => (
                <div key={sess.id} className="rounded-card border border-ink-100 bg-surface p-4 shadow-sm space-y-2.5">
                  <div>
                    <h4 className="font-semibold text-ink-900 text-sm">{sess.topic}</h4>
                    <p className="text-xs text-ink-500 mt-0.5">{sess.projectTitle} • {sess.universityName} • {sess.date}</p>
                  </div>
                  {sess.notes && (
                    <div className="bg-surface-alt p-3 rounded border border-ink-100 text-xs text-ink-600 space-y-1">
                      <span className="font-bold text-ink-800 flex items-center gap-1">
                        <AlignLeft className="h-3.5 w-3.5" /> Notes recorded:
                      </span>
                      <p className="leading-relaxed">{sess.notes}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Scheduler Modal */}
      {showScheduler && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setShowScheduler(false)} />
          
          <form
            onSubmit={handleScheduleSession}
            className="relative z-10 w-full max-w-md rounded-card bg-surface p-6 shadow-xl border border-ink-200 space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowScheduler(false)}
              className="absolute right-4 top-4 rounded p-1 text-ink-400 hover:bg-surface-sunken hover:text-ink-600"
            >
              <Plus className="h-5 w-5 rotate-45" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-ink-900 flex items-center gap-1.5">
                <Calendar className="h-5.5 w-5.5 text-teal-600" /> Schedule Mentorship Session
              </h3>
              <p className="text-xs text-ink-500 mt-1">Provide review hours to active students.</p>
            </div>

            <div>
              <label htmlFor="project" className="block text-xs font-bold text-ink-500 uppercase mb-1">Select Project</label>
              <select
                id="project"
                value={projectSelect}
                onChange={(e) => setProjectSelect(e.target.value)}
                className="w-full rounded border border-ink-200 bg-surface px-2.5 py-1.5 text-xs text-ink-700 focus:border-teal-500 focus:outline-none cursor-pointer"
              >
                <option>Smart Water Monitoring System</option>
                <option>Rural Health Diagnostics Hub</option>
              </select>
            </div>

            <div>
              <label htmlFor="topic" className="block text-xs font-bold text-ink-500 uppercase mb-1">Session Topic</label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Design review of waterproof sensors"
                className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="date" className="block text-xs font-bold text-ink-500 uppercase mb-1">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none cursor-pointer"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-xs font-bold text-ink-500 uppercase mb-1">Time Range</label>
                <input
                  id="time"
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 15:00 - 16:00"
                  className="w-full rounded border border-ink-200 bg-surface px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition cursor-pointer"
            >
              Confirm & Send Invites
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
