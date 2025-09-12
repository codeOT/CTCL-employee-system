import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecentReview {
  by: string;
  review: string;
  date: Date;
}

export interface IEmployee extends Document {
  fullName: string;
  employeeId: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
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

  //Health and pensions...
  pensionProvider?: string;
  pensionNumber?: string;
  hmoProvider?: string;
  hmoNumber?: string;

  position?: string;
  department?: string;
  joinDate?: Date;
  employeeType?: string;
  manager?: string;
  workLocation?: string;
  status: "Active" | "Inactive" | "On Leave" | "Terminated" | "Resigned" | "Remote";

  skills: string[];
  education: string[];
  documents: string[];

  recentReviews: IRecentReview[];
  achievements: string[];
}

const RecentReviewSchema = new Schema<IRecentReview>(
  {
    by: { type: String, required: true },
    review: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const EmployeeSchema = new Schema<IEmployee>(
  {
    // Required core fields
    fullName: { type: String, required: true, trim: true },
    employeeId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },

    // Personal infoo
    dateOfBirth: Date,
    address: String,
    emergencyContact: String,
    bloodGroup: String,
    nextOfKin: String,
    maritalStatus: String,
    stateOfOrigin: String,
    lga: String,
    bvn: String,
    nin: String,
    nokAddress: String,
    nokPhone: String,
    nokEmail: String,
    nokRelationship: String,
    bankName: String,
    bankAccountNumber: String,

    //Pensions & HMO
    pensionProvider: { type: String, trim: true },
    pensionNumber: { type: String, trim: true },
    hmoProvider: { type: String, trim: true },
    hmoNumber: { type: String, trim: true },
    

    //Employment d
    position: String,
    department: String,
    joinDate: Date,
    employeeType: String,
    manager: String,
    workLocation: String,

    //status fieldsss
    status: {
      type: String,
      enum: ["Active", "Inactive", "On Leave", "Terminated", "Resigned", "Remote"],
      default: "Active",
    },

    // Arrays defaults
    skills: { type: [String], default: [] },
    education: { type: [String], default: [] },
    documents: { type: [String], default: [] },
    recentReviews: { type: [RecentReviewSchema], default: [] },
    achievements: { type: [String], default: [] },
  },
  { timestamps: true }
);


const Employee: Model<IEmployee> =
  mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);

export default Employee;
