import { NextResponse } from "next/server"
import Employee from "@/models/Employee"
import connectDB from "@/lib/connectDB"


export async function GET() {
  try {
    await connectDB()

      const totalEmployees = await Employee.countDocuments({});
      const active = await Employee.countDocuments({status: "Active"});
      const remote = await Employee.countDocuments({status: "Remote"});
      const onLeave = await Employee.countDocuments({status: "On Leave"});

     

   return NextResponse.json({
    totalEmployees,
    active,
    remote,
    onLeave,
    presentToday: active + remote, 
  });
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    )
  }
}
