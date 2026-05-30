import {
  Check,
  UserPlus,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  ArrowRight,
} from "lucide-react";


const activityLogs = [
  {
    id: "log-001",
    workspace_id: "ws-001",
    task_id: "task-042",
    user_id: "user-bob",
    action: "task_updated",
    metadata: {
      task_title: "Fix login bug on Safari",
      changes: {
        status: { old: "in_progress", new: "done" },
      },
    },
    created_at: "2026-05-24T10:28:00Z",
    user_name: "Bob",
  },
  {
    id: "log-002",
    workspace_id: "ws-001",
    task_id: "task-038",
    user_id: "user-alice",
    action: "task_updated",
    metadata: {
      task_title: "Q3 report",
      changes: {
        assigned_to: { old: "Alice", new: "Carol" },
      },
    },
    created_at: "2026-05-24T10:12:00Z",
    user_name: "Alice",
  },
  {
    id: "log-003",
    workspace_id: "ws-001",
    task_id: "task-041",
    user_id: "user-carol",
    action: "task_created",
    metadata: {
      task_title: "Refactor authentication middleware",
      priority: "high",
    },
    created_at: "2026-05-24T09:30:00Z",
    user_name: "Carol",
  },
  {
    id: "log-004",
    workspace_id: "ws-001",
    task_id: "task-039",
    user_id: "user-dave",
    action: "task_updated",
    metadata: {
      task_title: "Hotfix payment",
      changes: {
        priority: { old: "medium", new: "urgent" },
      },
    },
    created_at: "2026-05-24T07:30:00Z",
    user_name: "Dave",
  },
  {
    id: "log-005",
    workspace_id: "ws-001",
    task_id: "task-035",
    user_id: "user-bob",
    action: "task_updated",
    metadata: {
      task_title: "Update API docs",
      changes: {
        status: { old: "done", new: "in_progress" },
      },
    },
    created_at: "2026-05-23T16:30:00Z",
    user_name: "Bob",
  },
  {
    id: "log-006",
    workspace_id: "ws-001",
    task_id: null,
    user_id: "user-alice",
    action: "task_deleted",
    metadata: {
      task_title: "Old feature spec",
    },
    created_at: "2026-05-23T14:15:00Z",
    user_name: "Alice",
  },
  {
    id: "log-007",
    workspace_id: "ws-001",
    task_id: "task-040",
    user_id: "user-alice",
    action: "task_created",
    metadata: {
      task_title: "Deploy backend to Render",
      priority: "medium",
    },
    created_at: "2026-05-23T11:00:00Z",
    user_name: "Alice",
  },
];

function classifyEvent(log: any) {
  if (log.action === "task_created") return "created";
  if (log.action === "task_deleted") return "deleted";

  const changes = log.metadata?.changes || {};

  if (changes.status) {
    if (changes.status.new === "done") return "completed";
    if (changes.status.old === "done") return "reopened";
  }
  if (changes.assigned_to) return "assigned";

  return "updated";
}

// Build a human-readable sentence
function describeEvent(log: any, kind:  string) {
  const user = log.user_name;
  const title = log.metadata?.task_title;
  const changes = log.metadata?.changes || {};

  switch (kind) {
    case "created":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span> created{" "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );
    case "completed":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span> completed{" "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );
    case "reopened":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span> reopened{" "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );
    case "assigned":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span> assigned{" "}
          <span className="text-slate-900">"{title}"</span> to{" "}
          {changes.assigned_to.new}
        </>
      );
    case "deleted":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span> deleted{" "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );
    default:
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span> updated{" "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );
  }
}

const eventVisuals = {
  created: { icon: Plus, bg: "bg-blue-100", color: "text-blue-700" },
  completed: { icon: Check, bg: "bg-emerald-100", color: "text-emerald-700" },
  updated: { icon: Edit, bg: "bg-amber-100", color: "text-amber-700" },
  assigned: { icon: UserPlus, bg: "bg-violet-100", color: "text-violet-700" },
  deleted: { icon: Trash2, bg: "bg-red-100", color: "text-red-700" },
  reopened: { icon: RotateCcw, bg: "bg-cyan-100", color: "text-cyan-700" },
};

const fieldLabels = {
  status: "Status",
  priority: "Priority",
  assigned_to: "Assignee",
  due_date: "Due date",
};

function pretty(v: any) {
  if (v === null || v === undefined) return "—";
  return String(v).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day === 1) return "Yesterday";
  return `${day}d ago`;
}

function groupByDay(logs: any[]) {
  const groups = {};
  logs.forEach((log) => {
    const date = new Date(log.created_at);
    const today = new Date();
    const yest = new Date();
    yest.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYest = date.toDateString() === yest.toDateString();

    let label;
    if (isToday) label = "Today";
    else if (isYest) label = "Yesterday";
    else label = date.toLocaleDateString(undefined, { weekday: "long" });

    const dateStr = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const fullLabel = `${label} · ${dateStr}`;

    if (!groups[fullLabel]) groups[fullLabel] = [];
    groups[fullLabel].push(log);
  });
  return groups;
}

function DiffPill({ field, change }: { field: string; change: any }) {
  return (
    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
      <span>{fieldLabels[field] || field}</span>
      <span className="text-slate-400 line-through">{pretty(change.old)}</span>
      <ArrowRight className="h-3 w-3 text-slate-400" />
      <span className="font-medium text-slate-900">{pretty(change.new)}</span>
    </div>
  );
}

function ActivityItem({ log }: { log: any }) {
  const kind = classifyEvent(log);
  const visual = eventVisuals[kind];
  const Icon = visual.icon;
  const changes = log.metadata?.changes || {};

  return (
    <div className="flex items-start gap-3 py-2.5">
      {/* Icon circle */}
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${visual.bg}`}
      >
        <Icon className={`h-3.5 w-3.5 ${visual.color}`} />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-relaxed text-slate-700">
          {describeEvent(log, kind)}
        </p>

        {/* Diff pills — one per changed field */}
        {Object.entries(changes).map(([field, change]) => (
          <DiffPill key={field} field={field} change={change} />
        ))}

        <p className="mt-1 text-[11px] text-slate-400">
          {timeAgo(log.created_at)}
        </p>
      </div>
    </div>
  );
}

// ---------- Day Group ----------

function DayGroup({ label, logs }: { label: string; logs: any[] }) {
  return (
    <div className="mb-4">
      <p className="mb-2.5 border-b border-slate-100 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>
      {logs.map((log) => (
        <ActivityItem key={log.id} log={log} />
      ))}
    </div>
  );
}

export const ActivityFeed =  () => {
  const grouped = groupByDay(activityLogs);

  return (
    <div className="bg-white p-4">
      {Object.entries(grouped).map(([label, logs]) => (
        <DayGroup key={label} label={label} logs={logs || [] as any} />
      ))}
    </div>
  );
}