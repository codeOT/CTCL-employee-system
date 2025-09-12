"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, Clock, Calendar, Briefcase } from "lucide-react";

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }
    fetchStats();
  }, []);

  if (!stats) {
    return <p className="text-gray-500">Loading dashboard stats...</p>;
  }

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      sub: `+${stats.totalEmployees - 62} from last month`,
      icon: Users,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      subColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Present Today",
      value: stats.presentToday,
      sub: stats.totalEmployees
        ? `${Math.round(
            (stats.presentToday / stats.totalEmployees) * 100
          )}% attendance rate`
        : "0% attendance rate",
      icon: Clock,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      subColor: "text-gray-500 dark:text-gray-400",
    },
    {
      title: "On Leave",
      value: stats.onLeave,
      sub: `${Math.round(
        (stats.onLeave / stats.totalEmployees) * 100
      )}% of workforce`,
      icon: Calendar,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      subColor: "text-gray-500 dark:text-gray-400",
    },
    // {
    //   title: "Active Projects",
    //   value: stats.activeProjects,
    //   sub: "3 due this week",
    //   icon: Briefcase,
    //   iconBg: "bg-purple-100 dark:bg-purple-900/30",
    //   iconColor: "text-purple-600 dark:text-purple-400",
    //   subColor: "text-amber-600 dark:text-amber-400",
    // },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="shadow-sm hover:shadow-md transition-shadow p-6 rounded-2xl"
        >
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-full ${card.iconBg} mr-3`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold">{card.value}</p>
              <p className={`text-xs ${card.subColor}`}>{card.sub}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
