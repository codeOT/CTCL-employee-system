// app/dashboard/employees/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/connectDB";
import Employee from "@/models/Employee";
import { ViewEmployeeDetails } from "@/components/employees/view-employee-details";

interface EmployeePageProps {
  params: Promise<{ id: string }>; 
}

export default async function EmployeePage({ params }: EmployeePageProps) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  await connectDB();

  // ✅ Await params
  const { id } = await params;

  try {
    const employee = await Employee.findById(id).lean();
    if (!employee) return notFound();

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Employee Details</h1>
        <ViewEmployeeDetails employee={JSON.parse(JSON.stringify(employee))} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching employee:", error);
    return notFound();
  }
}
