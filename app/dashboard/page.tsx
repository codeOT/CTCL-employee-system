import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentEmployees } from "@/components/dashboard/recent-employees"
import { DepartmentDistribution } from "@/components/dashboard/department-distribution"
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
   const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") redirect("/login");

 

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <DashboardStats />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
        <RecentEmployees />
        <DepartmentDistribution />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
     
      </div>
    </div>
  )
}
