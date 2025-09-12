import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Employee from "@/models/Employee";

// Helper function to clean update data
function normalizeForUpdate(data: Record<string, any>) {
  const cleaned: Record<string, any> = {};
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== "") {
      cleaned[key] = data[key];
    }
  }
  return cleaned;
}

// GET employee by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // Await params
    await connectDB();
    const employee = await Employee.findById(id);

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error("Error fetching employee:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE employee by ID
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // Await params
    await connectDB();

    const body = normalizeForUpdate(await req.json());
    const updated = await Employee.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating employee:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE employee by ID
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // Await params
    await connectDB();

    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
