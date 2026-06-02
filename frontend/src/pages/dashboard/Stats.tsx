import { getMetrics } from "@/api/taskService/taskService";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, AlertCircle, CheckCircle2, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import type { DashboardState } from "./types";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Activity = {
  initials: string;
  color: string;
  text: string;
  time: string;
};

const activities: Activity[] = [
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
  const [dashboard, setDashboard] = useState<DashboardState>({
    stats: [],
    priorities: [],
    velocity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics();

        setDashboard({
          stats: [
            {
              title: "TOTAL TASKS",
              value: data.tasks.total_tasks.toString(),
              description: "+3 this week",
              color: "text-emerald-500",
              icon: Activity,
            },
            {
              title: "IN PROGRESS",
              value: data.tasks_by_status.in_progress.toString(),
              description: "2 due today",
              color: "text-slate-500",
              icon: Clock3,
            },
            {
              title: "COMPLETED",
              value: data.tasks.completed_tasks.toString(),
              description: "+8 this week",
              color: "text-emerald-500",
              icon: CheckCircle2,
            },
            {
              title: "OVERDUE",
              value: data.tasks.overdue_tasks.toString(),
              description: "Needs attention",
              color: "text-red-500",
              icon: AlertCircle,
            },
          ],

          priorities: [
            {
              label: "Highest",
              value: data.tasks.total_tasks,
              count: data.tasks_by_priority.highest,
              color: "bg-red-500",
            },
            {
              label: "High",
              value: data.tasks.total_tasks,
              count: data.tasks_by_priority.high,
              color: "bg-orange-500",
            },
            {
              label: "Medium",
              value: data.tasks.total_tasks,
              count: data.tasks_by_priority.medium,
              color: "bg-sky-500",
            },
            {
              label: "Low",
              value: data.tasks.total_tasks,
              count: data.tasks_by_priority.low,
              color: "bg-slate-400",
            },
          ],

          velocity:
            data.velocity?.slice(0, 5).map((item) => ({
              name: item.username,
              value: item.completed_tasks,
              count: item.completed_tasks,
            })) || [],
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="rounded-xl border border-slate-200 bg-white shadow-none"
              >
                <CardContent className="p-4">
                  <Skeleton width={110} height={14} />

                  <div className="mt-3">
                    <Skeleton width={70} height={28} />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Skeleton circle width={16} height={16} />
                    <Skeleton width={120} height={14} />
                  </div>
                </CardContent>
              </Card>
            ))
          : dashboard.stats.map((item) => {
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

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-xl border border-slate-200 bg-white shadow-none">
          <CardContent className="p-4">
            {loading ? (
              <>
                <Skeleton width={160} height={20} />

                <div className="mt-6 space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[100px_1fr_32px] items-center gap-3"
                    >
                      <Skeleton width={60} height={14} />

                      <Skeleton
                        height={8}
                        containerClassName="w-full"
                        borderRadius={9999}
                      />

                      <Skeleton width={20} height={14} />
                    </div>
                  ))}
                </div>

                <div className="my-5 h-px bg-slate-200" />

                <Skeleton width={120} height={20} />

                <div className="mt-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[100px_1fr_32px] items-center gap-3"
                    >
                      <Skeleton width={80} height={14} />

                      <Skeleton
                        height={8}
                        containerClassName="w-full"
                        borderRadius={9999}
                      />

                      <Skeleton width={20} height={14} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-base font-medium text-slate-900">
                  Priority Overview
                </h2>

                <div className="mt-4 space-y-3">
                  {dashboard.priorities.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-[100px_1fr_32px] items-center gap-3"
                    >
                      <span className="text-sm text-slate-600">
                        {item.label}
                      </span>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{
                            width: `${(item.count / item.value) * 100}%`,
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

                <div>
                  <h3 className="text-base font-medium text-slate-900">
                    Team Velocity
                  </h3>

                  <div className="mt-4 space-y-3">
                    {dashboard.velocity.map((item) => (
                      <div
                        key={item.name}
                        className="grid grid-cols-[100px_1fr_32px] items-center gap-3"
                      >
                        <span className="text-sm text-slate-600">
                          {item.name}
                        </span>

                        <Progress
                          value={item.value}
                          className="h-2 bg-slate-400"
                        />

                        <span className="text-right text-sm font-medium text-slate-900">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 bg-white shadow-none">
          <CardContent className="p-4">
            {loading ? (
              <>
                <div className="flex items-center justify-between">
                  <Skeleton width={140} height={20} />
                  <Skeleton width={60} height={16} />
                </div>

                <div className="mt-5 space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index}>
                      <div className="flex gap-3">
                        <Skeleton circle width={28} height={28} />

                        <div className="flex-1">
                          <Skeleton height={14} width="85%" />
                          <Skeleton height={12} width={60} className="mt-2" />
                        </div>
                      </div>

                      {index !== 4 && (
                        <div className="mt-4 h-px bg-slate-100" />
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
