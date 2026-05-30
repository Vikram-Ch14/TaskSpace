import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, AlertCircle, CheckCircle2, Clock3 } from "lucide-react";

const stats = [
  {
    title: "TOTAL TASKS",
    value: "47",
    description: "+3 this week",
    color: "text-emerald-500",
    icon: Activity,
  },
  {
    title: "IN PROGRESS",
    value: "12",
    description: "2 due today",
    color: "text-slate-500",
    icon: Clock3,
  },
  {
    title: "COMPLETED",
    value: "23",
    description: "+8 this week",
    color: "text-emerald-500",
    icon: CheckCircle2,
  },
  {
    title: "OVERDUE",
    value: "3",
    description: "Needs attention",
    color: "text-red-500",
    icon: AlertCircle,
  },
];

const priorities = [
  {
    label: "Highest",
    value: 20,
    count: 3,
    color: "bg-red-500",
  },
  {
    label: "High",
    value: 55,
    count: 14,
    color: "bg-orange-500",
  },
  {
    label: "Medium",
    value: 78,
    count: 22,
    color: "bg-sky-500",
  },
  {
    label: "Low",
    value: 30,
    count: 8,
    color: "bg-slate-400",
  },
];

const velocity = [
  {
    name: "Bob",
    value: 76,
    count: 9,
  },
  {
    name: "Carol",
    value: 60,
    count: 7,
  },
  {
    name: "Alice",
    value: 45,
    count: 5,
  },
];

const activities = [
  {
    initials: "B",
    color: "bg-emerald-500",
    text: 'Bob completed "Fix login bug"',
    time: "2 min ago",
  },
  {
    initials: "A",
    color: "bg-violet-500",
    text: 'Alice assigned "Q3 report" to Carol',
    time: "18 min ago",
  },
  {
    initials: "C",
    color: "bg-sky-500",
    text: 'Carol created "Refactor auth"',
    time: "1h ago",
  },
  {
    initials: "D",
    color: "bg-amber-500",
    text: 'Dave updated priority of "Hotfix payment"',
    time: "3h ago",
  },
  {
    initials: "B",
    color: "bg-emerald-500",
    text: 'Bob reopened "Update docs"',
    time: "5h ago",
  },
];

export const Stats = () => {
  return (
    <>
      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white shadow-none"
            >
              <CardContent className="p-4">
                <p className="text-sm font-medium tracking-wide text-slate-500">
                  {item.title}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`mt-3 flex items-center gap-2 text-sm font-medium ${item.color}`}
                >
                  <Icon className="h-4 w-4" />

                  <span>{item.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
        {/* Priority Overview */}
        <Card className="rounded-xl border border-slate-200 bg-white shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-slate-900">
                Priority Overview
              </h2>

              <span className="text-sm text-slate-500">Last 30 days</span>
            </div>

            <div className="mt-4 space-y-3">
              {priorities.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[100px_1fr_32px] items-center gap-3"
                >
                  <span className="text-sm text-slate-600">{item.label}</span>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${item.value}%`,
                      }}
                    />
                  </div>

                  <span className="text-right text-sm font-medium text-slate-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5 h-px bg-slate-200" />

            {/* Team Velocity */}
            <div>
              <h3 className="text-base font-medium text-slate-900">
                Team Velocity
              </h3>

              <div className="mt-4 space-y-3">
                {velocity.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-[100px_1fr_32px] items-center gap-3"
                  >
                    <span className="text-sm text-slate-600">{item.name}</span>

                    <Progress value={item.value} className="h-2 bg-slate-400" />

                    <span className="text-right text-sm font-medium text-slate-900">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-xl border border-slate-200 bg-white shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-slate-900">
                Recent Activity
              </h2>

              <button className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                View all
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {activities.map((item, index) => (
                <div key={index}>
                  <div className="flex gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${item.color}`}
                    >
                      {item.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-slate-900">
                        {item.text}
                      </p>

                      <span className="mt-1 block text-xs text-slate-400">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  {index !== activities.length - 1 && (
                    <div className="mt-3 h-px bg-slate-100" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
