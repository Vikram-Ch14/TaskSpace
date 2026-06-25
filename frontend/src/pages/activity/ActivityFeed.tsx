import { getActivityLogs } from "@/api/activityService/activityService";
import {
  type ActivityLog,
  type ActivityChange,
  type ActivityEventType,
} from "@/api/activityService/types";
import { useActivityStore, type ActivityStatus } from "@/stores/activityStore";
import {
  Check,
  UserPlus,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const eventVisuals = {
  created: { icon: Plus, bg: "bg-blue-100", color: "text-blue-700" },
  completed: { icon: Check, bg: "bg-emerald-100", color: "text-emerald-700" },
  updated: { icon: Edit, bg: "bg-amber-100", color: "text-amber-700" },
  assigned: { icon: UserPlus, bg: "bg-violet-100", color: "text-violet-700" },
  deleted: { icon: Trash2, bg: "bg-red-100", color: "text-red-700" },
  reopened: { icon: RotateCcw, bg: "bg-cyan-100", color: "text-cyan-700" },
};

const fieldLabels: Record<string, string> = {
  status: "Status",
  priority: "Priority",
  assigned_to: "Assignee",
  due_date: "Due date",
};

interface DayGroupProps {
  label: string;
  logs: ActivityLog[];
}

interface DiffPillProps {
  field: string;
  change: ActivityChange;
}

interface ActivityItemProps {
  log: ActivityLog;
}

const classifyEvent = (log: ActivityLog): ActivityEventType => {
  if (log.action === "task_created") return "created";
  if (log.action === "task_deleted") return "deleted";

  const changes = log.metadata.changes ?? {};

  if (changes.status?.new === "done") {
    return "completed";
  }

  return "updated";
};

const describeEvent = (
  log: ActivityLog,
  kind: ActivityEventType,
): React.ReactNode => {
  const user = log.user_name;
  const title = log.metadata.task_title;
  const changes = log.metadata.changes ?? {};

  switch (kind) {
    case "created":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span>
          {" created "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );

    case "completed":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span>
          {" completed "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );

    case "reopened":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span>
          {" reopened "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );

    case "assigned":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span>
          {" assigned "}
          <span className="text-slate-900">"{title}"</span>
          {" to "}
          {changes.assigned_to?.new}
        </>
      );

    case "deleted":
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span>
          {" deleted "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );

    default:
      return (
        <>
          <span className="font-medium text-slate-900">{user}</span>
          {" updated "}
          <span className="text-slate-900">"{title}"</span>
        </>
      );
  }
};

const pretty = (value: unknown): string => {
  if (value === null || value === undefined) return "—";

  const date = new Date(String(value));

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString();
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const timeAgo = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day === 1) return "Yesterday";
  return `${day}d ago`;
};

const groupByDay = (logs: ActivityLog[]): Record<string, ActivityLog[]> => {
  const groups: Record<string, ActivityLog[]> = {};

  logs.forEach((log) => {
    const date = new Date(log.created_at);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    let label: string;

    if (isToday) label = "Today";
    else if (isYesterday) label = "Yesterday";
    else {
      label = date.toLocaleDateString(undefined, {
        weekday: "long",
      });
    }

    const dateStr = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    const fullLabel = `${label} · ${dateStr}`;

    if (!groups[fullLabel]) {
      groups[fullLabel] = [];
    }

    groups[fullLabel].push(log);
  });

  return groups;
};

const DiffPill = ({ field, change }: DiffPillProps) => {
  return (
    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
      <span>{fieldLabels[field] ?? field}</span>

      <span className="text-slate-400 line-through">{pretty(change.old)}</span>

      <ArrowRight className="h-3 w-3 text-slate-400" />

      <span className="font-medium text-slate-900">{pretty(change.new)}</span>
    </div>
  );
};

const ActivityItem = ({ log }: ActivityItemProps) => {
  const kind = classifyEvent(log);
  const visual = eventVisuals[kind];
  const Icon = visual.icon;

  const changes = log.metadata.changes ?? {};

  return (
    <div className="flex items-start gap-3 py-2.5">
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${visual.bg}`}
      >
        <Icon className={`h-3.5 w-3.5 ${visual.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-relaxed text-slate-700">
          {describeEvent(log, kind)}
        </p>

        {Object.entries(changes).map(([field, change]) => (
          <DiffPill key={field} field={field} change={change} />
        ))}

        <p className="mt-1 text-[11px] text-slate-400">
          {timeAgo(log.created_at)}
        </p>
      </div>
    </div>
  );
};

const DayGroup = ({ label, logs }: DayGroupProps) => {
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
};

export const ActivityFeed = () => {
  const activityStatus = useActivityStore((state) => state.activityStatus);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);


  const filteredLogs = useMemo(() => {
    if (activityStatus.length === 0 || activityStatus.includes("all")) {
      return activityLogs;
    }

    return activityLogs.filter((log) =>
      activityStatus.includes(classifyEvent(log) as ActivityStatus),
    );
  }, [activityLogs, activityStatus]);

  const grouped = useMemo(() => groupByDay(filteredLogs), [filteredLogs]);


  useEffect(() => {
    async function fetchLogs() {
      try {
        const logs = await getActivityLogs();
        setActivityLogs(logs);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      }
    }

    fetchLogs();
  }, []);

  return (
    <div className="bg-white p-4">
      {Object.entries(grouped).map(([label, logs]) => (
        <DayGroup key={label} label={label} logs={logs || ([] as any)} />
      ))}
    </div>
  );
};
