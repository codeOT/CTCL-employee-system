"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface AddEmployeeFormProps {
  onSubmit: (employee: any) => void; // You can replace `any` with your IEmployee type
  onCancel: () => void;
}

export function AddEmployeeForm({ onSubmit, onCancel }: AddEmployeeFormProps) {
  const [formData, setFormData] = useState({
    employeeId: "", // Added Employee ID field
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
    bloodGroup: "",
    nextOfKin: "",
    maritalStatus: "",
    stateOfOrigin: "",
    lga: "",
    bvn: "",
    nin: "",
    nokAddress: "",
    nokPhone: "",
    nokEmail: "",
    nokRelationship: "",
    bankName: "",
    bankAccountNumber: "",
    position: "",
    department: "",
    joinDate: new Date().toISOString().split("T")[0],
    employeeType: "",
    manager: "",
    workLocation: "",
    status: "Active",
    pensionProvider: "",
    pensionNumber: "",
    hmoProvider: "",
    hmoNumber: "",
    skills: "",
    education: "",
    recentReviews: "",
    achievements: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(",").map((s) => s.trim()),
          education: formData.education.split(",").map((s) => s.trim()),
          recentReviews: formData.recentReviews.split(",").map((s) => s.trim()),
          achievements: formData.achievements.split(",").map((s) => s.trim()),
        }),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        toast({
          title: "Employee Added",
          description: `${formData.fullName} added successfully`,
        });
        setFormData({ 
          ...formData, 
          employeeId: "", 
          fullName: "", 
          email: "", 
          phone: "" 
        }); // reset some fields
        onSubmit(result);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add employee",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Server error",
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-full overflow-y-auto space-y-6 p-4"
    >
      {/* Personal Info */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Employee ID *</Label>
            <Input
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="CTCL.." 
              required
            />
          </div>
          <div>
            <Label>Full Name *</Label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Emergency Contact</Label>
            <Input
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Blood Group</Label>
            <Input
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Marital Status</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, maritalStatus: val }))
              }
              value={formData.maritalStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>State of Origin</Label>
            <Input
              name="stateOfOrigin"
              value={formData.stateOfOrigin}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>LGA</Label>
            <Input name="lga" value={formData.lga} onChange={handleChange} />
          </div>
          <div>
            <Label>BVN</Label>
            <Input name="bvn" value={formData.bvn} onChange={handleChange} />
          </div>
          <div>
            <Label>NIN</Label>
            <Input name="nin" value={formData.nin} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* Next of Kin */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Next of Kin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Next of Kin</Label>
            <Input
              name="nextOfKin"
              value={formData.nextOfKin}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Relationship</Label>
            <Input
              name="nokRelationship"
              value={formData.nokRelationship}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              name="nokAddress"
              value={formData.nokAddress}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              name="nokPhone"
              value={formData.nokPhone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              name="nokEmail"
              value={formData.nokEmail}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Bank Name</Label>
            <Input
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Account Number</Label>
            <Input
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Employment Info */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Employment Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Position</Label>
            <Input
              name="position"
              value={formData.position}
              onChange={handleChange}
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
          <div>
            <Label>Join Date</Label>
            <Input
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Employee Type</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, employeeType: val }))
              }
              value={formData.employeeType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee Type" />
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
          <div>
            <Label>Manager</Label>
            <Input
              name="manager"
              value={formData.manager}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Work Location</Label>
            <Input
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, status: val }))
              }
              value={formData.status}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pensions and HMO */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Pensions and HMO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Pension Provider</Label>
            <Input
              name="pensionProvider"
              value={formData.pensionProvider}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Pension Number</Label>
            <Input
              name="pensionNumber"
              value={formData.pensionNumber}
              onChange={handleChange}
              placeholder="Enter Pension Number"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>HMO Provider</Label>
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
          <div>
            <Label>HMO Number</Label>
            <Input
              name="hmoNumber"
              value={formData.hmoNumber}
              onChange={handleChange}
              placeholder="Enter HMO Number"
            />
          </div>
        </div>
      </div>

      {/* Skills & Education */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Skills & Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Skills (comma separated)</Label>
            <Input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Education (comma separated)</Label>
            <Input
              name="education"
              value={formData.education}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Performance */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Recent Reviews (comma separated)</Label>
            <Input
              name="recentReviews"
              value={formData.recentReviews}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Achievements (comma separated)</Label>
            <Input
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
          Add Employee
        </Button>
      </div>
    </form>
  );
}