// app/dashboard/employees/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {EmployeeDirectory} from "@/components/employees/employee-directory";

export default async function EmployeesPage() {
  const session = await getServerSession(authOptions);

  // Only allow admins to access this page
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Employee Directory</h1>
      </div>
      <EmployeeDirectory />
    </div>
  );
}
