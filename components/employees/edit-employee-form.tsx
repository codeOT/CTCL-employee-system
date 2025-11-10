"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EmployeeFormData } from "@/types/employee";

interface Props {
  employee: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

export function EditEmployeeForm({ employee, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState<EmployeeFormData>(employee);
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined
  );
  const [joinDate, setJoinDate] = useState<Date | undefined>(
    formData.joinDate ? new Date(formData.joinDate) : undefined
  );
  const [birthOpen, setBirthOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const setField = (name: keyof EmployeeFormData, value: any) => {
    console.log(`Setting field ${name} to:`, value); // Debug log
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      console.log("Updated form data:", updated); // Debug log
      return updated;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission - Current formData:", formData); // Debug log
    console.log("Status field specifically:", formData.status); // Debug log

    // Ensure all required fields are present
    const submitData = {
      ...formData,
      // Explicitly include the status to ensure it's not undefined
      status: formData.status || "Active",
    };

    console.log("Data being submitted:", submitData); // Debug log
    onSubmit(submitData);
  };

  return (
    <form onSubmit={submit}>
      <ScrollArea className="h-[70vh] w-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information */}
          <h2 className="md:col-span-2 text-lg font-semibold">
            Personal Information
          </h2>

          {/* Employee ID Field */}
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID *</Label>
            <Input
              id="employeeId"
              value={formData.employeeId || ""}
              onChange={(e) => setField("employeeId", e.target.value)}
              placeholder="CTCL.."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName || ""}
              onChange={(e) => setField("fullName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => setField("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </div>

          {/* Dates */}
          <h2 className="md:col-span-2 text-lg font-semibold">Date</h2>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <input
              type="date"
              value={birthDate ? format(birthDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                if (e.target.value) {
                  const newDate = new Date(e.target.value);
                  setBirthDate(newDate);
                  setField("dateOfBirth", e.target.value);
                }
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label>Join Date</Label>
            <input
              type="date"
              value={joinDate ? format(joinDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                if (e.target.value) {
                  const newDate = new Date(e.target.value);
                  setJoinDate(newDate);
                  setField("joinDate", e.target.value);
                }
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Employment */}
          <h2 className="md:col-span-2 text-lg font-semibold">
            Employment Details
          </h2>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position || ""}
              onChange={(e) => setField("position", e.target.value)}
            />
          </div>
          <div>
            <Label>Department</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, department: val }))
              }
              value={formData.department}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Business Development">
                  Business Development
                </SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employeeType">Employee Type</Label>
            <Select
              value={formData.employeeType || undefined}
              onValueChange={(value) => setField("employeeType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager">Manager</Label>
            <Input
              id="manager"
              value={formData.manager || ""}
              onChange={(e) => setField("manager", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workLocation">Work Location</Label>
            <Input
              id="workLocation"
              value={formData.workLocation || ""}
              onChange={(e) => setField("workLocation", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">
              Status * (Current: {formData.status || "Not set"})
            </Label>
            <Select
              value={formData.status || undefined}
              onValueChange={(value) => setField("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
                <SelectItem value="Resigned">Resigned</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Personal & Contact */}
          <h2 className="md:col-span-2 text-lg font-semibold">
            Personal & Contact Info
          </h2>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => setField("address", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact || ""}
              onChange={(e) => setField("emergencyContact", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Input
              id="bloodGroup"
              value={formData.bloodGroup || ""}
              onChange={(e) => setField("bloodGroup", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
            <Select
              value={formData.maritalStatus || undefined}
              onValueChange={(value) => setField("maritalStatus", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Personal Info */}
          <div className="space-y-2">
            <Label htmlFor="stateOfOrigin">State of Origin</Label>
            <Input
              id="stateOfOrigin"
              value={formData.stateOfOrigin || ""}
              onChange={(e) => setField("stateOfOrigin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lga">LGA</Label>
            <Input
              id="lga"
              value={formData.lga || ""}
              onChange={(e) => setField("lga", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bvn">BVN</Label>
            <Input
              id="bvn"
              value={formData.bvn || ""}
              onChange={(e) => setField("bvn", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nin">NIN</Label>
            <Input
              id="nin"
              value={formData.nin || ""}
              onChange={(e) => setField("nin", e.target.value)}
            />
          </div>

          {/* Next of Kin */}
          <h2 className="md:col-span-2 text-lg font-semibold">Next of Kin</h2>
          <div className="space-y-2">
            <Label htmlFor="nextOfKin">Next of Kin</Label>
            <Input
              id="nextOfKin"
              value={formData.nextOfKin || ""}
              onChange={(e) => setField("nextOfKin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nokRelationship">Relationship</Label>
            <Input
              id="nokRelationship"
              value={formData.nokRelationship || ""}
              onChange={(e) => setField("nokRelationship", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nokPhone">Phone</Label>
            <Input
              id="nokPhone"
              value={formData.nokPhone || ""}
              onChange={(e) => setField("nokPhone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nokEmail">Email</Label>
            <Input
              id="nokEmail"
              value={formData.nokEmail || ""}
              onChange={(e) => setField("nokEmail", e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nokAddress">Address</Label>
            <Input
              id="nokAddress"
              value={formData.nokAddress || ""}
              onChange={(e) => setField("nokAddress", e.target.value)}
            />
          </div>

          {/* Bank Details */}
          <h2 className="md:col-span-2 text-lg font-semibold">Bank Details</h2>
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={formData.bankName || ""}
              onChange={(e) => setField("bankName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
            <Input
              id="bankAccountNumber"
              value={formData.bankAccountNumber || ""}
              onChange={(e) => setField("bankAccountNumber", e.target.value)}
            />
          </div>

          {/* Pension and HMO */}
          <h2 className="md:col-span-2 text-lg font-semibold">
            Pensions and HMO
          </h2>
          <div className="space-y-2">
            <Label>Pension Provider</Label>
            <Input
              id="pensionProvider"
              value={formData.pensionProvider || ""}
              onChange={(e) => setField("pensionProvider", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Pension Number</Label>
            <Input
              name="pensionNumber"
              value={formData.pensionNumber || ""}
              onChange={(e) => setField("pensionNumber", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hmoProvider">HMO Provider</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, hmoProvider: val }))
              }
              value={formData.hmoProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select HMO Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Leadway HMO">Leadway HMO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>HMO Number</Label>
            <Input
              name="hmoNumber"
              value={formData.hmoNumber || ""}
              onChange={(e) => setField("hmoNumber", e.target.value)}
            />
          </div>

          {/* Skills & Education */}
          <h2 className="md:col-span-2 text-lg font-semibold">
            Skills & Education
          </h2>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={
                Array.isArray(formData.skills)
                  ? formData.skills.join(", ")
                  : formData.skills || ""
              }
              onChange={(e) => setField("skills", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Education (comma separated)</Label>
            <Input
              id="education"
              value={
                Array.isArray(formData.education)
                  ? formData.education.join(", ")
                  : formData.education || ""
              }
              onChange={(e) => setField("education", e.target.value)}
            />
          </div>

          {/* Achievements */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="achievements">Achievements (comma separated)</Label>
            <Input
              id="achievements"
              value={
                Array.isArray(formData.achievements)
                  ? formData.achievements.join(", ")
                  : formData.achievements || ""
              }
              onChange={(e) => setField("achievements", e.target.value)}
            />
          </div>

          {/* Optional Review */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="recentReviewsText">Add Review (optional)</Label>
            <Textarea
              id="recentReviewsText"
              value={formData.recentReviewsText || ""}
              onChange={(e) => setField("recentReviewsText", e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
