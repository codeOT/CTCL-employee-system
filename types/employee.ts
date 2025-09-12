export type EmployeeStatus = "Active" | "Inactive" | "On Leave" | "Terminated" | "Resigned" | "Remote";

export interface RecentReview {
  by: string;
  review: string;
  date: string | Date;
}

/** What the server returns / DB shape */
export interface Employee {
  _id: string;
  employeeId: string;

  fullName: string;
  email: string;
  phone?: string;

  dateOfBirth?: string; // ISO string in client
  address?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  nextOfKin?: string;
  maritalStatus?: string;
  stateOfOrigin?: string;
  lga?: string;
  bvn?: string;
  nin?: string;
  nokAddress?: string;
  nokPhone?: string;
  nokEmail?: string;
  nokRelationship?: string;
  bankName?: string;
  bankAccountNumber?: string;

  position?: string;
  department?: string;
  joinDate?: string; // ISO string in client
  employeeType?: string;
  manager?: string;
  workLocation?: string;
  status: EmployeeStatus;

  // Benefits
  pensionProvider?: string;
  pensionNumber?: string;
  hmoProvider?: string;
  hmoNumber?: string;

  skills: string[];
  education: string[];
  documents: string[];

  recentReviews: RecentReview[];
  achievements: string[];
}

/** What your forms submit (can omit id/employeeId; includes helper field) */
export interface EmployeeFormData
  extends Omit<Employee, "_id" | "employeeId" | "recentReviews"> {
  _id?: string;
  employeeId?: string;
  /** Optional free-text review line in the form; backend converts it */
  recentReviewsText?: string;
  recentReviews?: RecentReview[]; // allow array too; backend coerces
}
