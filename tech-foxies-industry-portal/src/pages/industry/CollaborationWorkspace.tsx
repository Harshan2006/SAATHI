import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Users,
  FolderOpen,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  Building,
  User,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { activeCollaborations } from "../../data/industryMockData";
import { useToast } from "../../components/shared/Toast";

export default function CollaborationWorkspace() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const collab = activeCollaborations.find((c) => c.projectId === id) || activeCollaborations[0];

  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "milestones" | "messages" | "documents">("overview");

  // Message chat states
  const [chatMessages, setChatMessages] = useState(collab.messages);
  const [newMessage, setNewMessage] = useState("");

  // Task list states
  const [taskList, setTaskList] = useState(collab.tasks);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: `msg-new-${Date.now()}`,
      senderName: "Siddharth Sen",
      senderRole: "ABC Engineering Lead",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages([...chatMessages, msg]);
    setNewMessage("");
    showToast("Message sent to project workspace.", "success");
  };

  const toggleTaskStatus = (taskId: string) => {
    setTaskList(
      taskList.map((t) => {
        if (t.id === taskId) {
          const nextStatus =
            t.status === "Completed"
              ? "In Progress"
              : t.status === "In Progress"
              ? "Pending"
              : "Completed";
          showToast(`Task status set to ${nextStatus}.`, "success");
          return { ...t, status: nextStatus as any };
        }
        return t;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs text-ink-500">
        <Link to="/collaborations" className="hover:underline">Collaborations</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-ink-700">{collab.projectId}</span>
      </div>

      {/* Header block */}
      <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100 uppercase">
              {collab.currentStage}
            </span>
            <h2 className="text-xl font-bold text-ink-900 lg:text-2xl mt-1.5">{collab.projectTitle}</h2>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-500 mt-1">
              <span className="flex items-center gap-0.5"><Building className="h-3.5 w-3.5 text-ink-400" /> {collab.universityName}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><Users className="h-3.5 w-3.5 text-ink-400" /> {collab.companyRole}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-ink-500">Progress:</span>
            <span className="text-sm font-bold text-teal-700">{collab.progress}%</span>
            <div className="w-16 bg-ink-100 rounded-full h-2 overflow-hidden">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${collab.progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-ink-200">
        {[
          { id: "overview", label: "Workspace Overview", icon: FolderOpen },
          { id: "tasks", label: "Tasks Manager", icon: CheckCircle2 },
          { id: "milestones", label: "Milestones", icon: Calendar },
          { id: "messages", label: "Team Messages", icon: MessageSquare },
          { id: "documents", label: "Shared Documents", icon: FolderOpen },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-semibold transition cursor-pointer -mb-px",
              activeTab === tab.id
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-ink-500 hover:text-ink-700"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content wrapper */}
      <div className="rounded-card border border-ink-100 bg-surface p-5 shadow-sm">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Activity Feed */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Recent Workspace Activity</h3>
              <div className="relative border-l border-ink-200 pl-4 ml-1 space-y-5 text-xs">
                {collab.recentActivity.map((act) => (
                  <div key={act.id} className="relative">
                    <span className="absolute -left-[21px] top-0.5 h-2 w-2 rounded-full bg-teal-600 border border-white" />
                    <div className="space-y-0.5">
                      <p className="text-ink-800">{act.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-ink-400">
                        <span>by {act.user}</span>
                        <span>•</span>
                        <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contacts panel */}
            <div className="space-y-4 border-t border-ink-100 pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
              <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Joint Workspace Team</h3>
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="text-ink-400 font-semibold block text-[10px] uppercase">Faculty Mentor</span>
                  <div className="flex items-center gap-2 text-ink-800 font-medium">
                    <User className="h-4 w-4 text-teal-600" />
                    <span>{collab.facultyMentor} (BIT)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-ink-400 font-semibold block text-[10px] uppercase">Student Team size</span>
                  <p className="text-ink-800 font-medium">{collab.studentTeamSize} active developers</p>
                </div>
                <div className="space-y-1">
                  <span className="text-ink-400 font-semibold block text-[10px] uppercase">Industry Liaisons</span>
                  <p className="text-ink-800 font-medium">Siddharth Sen (ABC Tech)</p>
                  <p className="text-ink-800 font-medium">Priya Nair (ABC Tech)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Collaborative Task Board</h3>
              <button
                onClick={() => showToast("Fictional task creation complete.", "info")}
                className="flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-teal-700 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Task
              </button>
            </div>

            <div className="space-y-2">
              {taskList.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between border border-ink-100 bg-surface-alt p-3.5 rounded hover:border-ink-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center transition cursor-pointer",
                        task.status === "Completed" ? "border-teal-600 bg-teal-600 text-white" : "border-ink-300 bg-white"
                      )}
                    >
                      {task.status === "Completed" && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                    <div>
                      <p className={cn("text-xs font-medium text-ink-900", task.status === "Completed" && "line-through text-ink-400")}>
                        {task.title}
                      </p>
                      <p className="text-[10px] text-ink-400 mt-0.5">Assignee: {task.assignee}</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-0.5 text-[10px] text-ink-500 font-medium">
                    <Clock className="h-3 w-3" /> Due {task.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "milestones" && (
          <div className="space-y-4 py-2">
            <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Project Milestones</h3>
            <div className="relative border-l border-ink-200 pl-4 ml-2 space-y-6 text-xs">
              {collab.milestones.map((milestone) => (
                <div key={milestone.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[21px] top-0 flex h-3 w-3 items-center justify-center rounded-full border bg-white",
                      milestone.status === "Completed"
                        ? "border-teal-600 bg-teal-600 text-white"
                        : milestone.status === "In Progress"
                        ? "border-teal-500 ring-2 ring-teal-100"
                        : "border-ink-200"
                    )}
                  >
                    {milestone.status === "Completed" && <CheckCircle2 className="h-2 w-2" />}
                  </span>
                  <div className="space-y-0.5">
                    <span className={cn("font-semibold block", milestone.status === "Completed" ? "text-ink-500 line-through" : milestone.status === "In Progress" ? "text-teal-700" : "text-ink-700")}>
                      {milestone.title}
                    </span>
                    <p className="text-ink-400 text-[10px]">
                      {milestone.status === "Completed" && milestone.completedDate
                        ? `Completed on ${milestone.completedDate}`
                        : `Target Date: ${milestone.dueDate}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Team Channel</h3>
            <div className="rounded border border-ink-200 h-80 flex flex-col bg-surface-alt">
              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {chatMessages.map((msg) => {
                  const isCompanySender = msg.senderRole.startsWith("ABC");
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[80%] rounded p-3 text-xs shadow-sm",
                        isCompanySender
                          ? "bg-teal-600 text-white ml-auto"
                          : "bg-surface text-ink-900 mr-auto border border-ink-100"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4 font-bold text-[10px] mb-1 opacity-90">
                        <span>{msg.senderName} ({msg.senderRole})</span>
                        <span className="font-medium font-mono text-[9px]">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Input section */}
              <form onSubmit={handleSendMessage} className="border-t border-ink-200 p-2.5 bg-surface flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message to the university team..."
                  className="flex-1 rounded border border-ink-200 bg-surface px-3 py-1.5 text-xs text-ink-800 focus:border-teal-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded bg-teal-600 p-2 text-white hover:bg-teal-700 transition cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h3 className="text-xs font-bold text-ink-955 uppercase tracking-wider">Shared Documents Pool</h3>
              <button
                onClick={() => showToast("Fictional document upload triggered.", "info")}
                className="flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-teal-700 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Upload File
              </button>
            </div>

            <div className="space-y-2">
              {collab.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between border border-ink-100 bg-surface-alt p-3.5 rounded hover:border-ink-200 transition text-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <FolderOpen className="h-5 w-5 text-ink-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-ink-900">{doc.name}</p>
                      <p className="text-[10px] text-ink-400 mt-0.5">Uploaded by {doc.uploadedBy} on {doc.uploadedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-ink-400 font-mono">({doc.size})</span>
                    <button
                      onClick={() => showToast(`Downloading ${doc.name}...`, "success")}
                      className="text-teal-600 hover:text-teal-700 font-semibold cursor-pointer"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
