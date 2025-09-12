import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Employee from "@/models/Employee";

function coerceToArray<T>(val: T | T[] | undefined | null): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Generate employeeId if missing
    if (!body.employeeId) {
      body.employeeId = `EMP${Date.now().toString().slice(-6)}`;
    }

    // Normalize dates from "yyyy-MM-dd" strings to Date
    if (body.dateOfBirth) body.dateOfBirth = new Date(body.dateOfBirth);
    if (body.joinDate) body.joinDate = new Date(body.joinDate);

    // Convert recentReviewsText or string recentReviews to array of objects
    const reviewsFromText =
      typeof body.recentReviewsText === "string" &&
      body.recentReviewsText.trim().length > 0
        ? [
            {
              by: "System",
              review: body.recentReviewsText.trim(),
              date: new Date(),
            },
          ]
        : [];

    const reviewsFromArray = coerceToArray(body.recentReviews)
      .filter(Boolean)
      .map((r: any) =>
        typeof r === "string"
          ? { by: "System", review: String(r), date: new Date() }
          : {
              by: r.by || "System",
              review: r.review ?? r.comment ?? "",
              date: r.date ? new Date(r.date) : new Date(),
            }
      )
      .filter((r) => r.review?.trim().length > 0);

    body.recentReviews = [...reviewsFromText, ...reviewsFromArray];
    delete body.recentReviewsText;

    // Ensure array fields default to []
    body.skills = coerceToArray<string>(body.skills);
    body.education = coerceToArray<string>(body.education);
    body.documents = coerceToArray<string>(body.documents);
    body.achievements = coerceToArray<string>(body.achievements);

    const employee = await Employee.create(body);
    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(employees, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
