import { NextResponse } from "next/server"
import connectDB from "@/lib/connectDB"
import Employee from "@/models/Employee"

export async function GET() {
  try {
    await connectDB()


    // Fetch latest 5 employees, sorted by join date
    const employees = await Employee.find({})
      .sort({ joinDate: -1 })
      .limit(5)

    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching recent employees:", error)
    return NextResponse.json(
      { error: "Failed to load recent employees" },
      { status: 500 }
    )
  }
}
