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
import { useToast } from "@/hooks/use-toast";

interface AddEmployeeFormProps {
  onSubmit: (employee: any) => void; 
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddEmployeeForm({ onSubmit, onCancel, isSubmitting = false }: AddEmployeeFormProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    employeeId: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      employeeId: "",
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.employeeId || !formData.fullName || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Employee ID, Full Name, and Email are required fields",
        variant: "destructive",
      });
      return;
    }

    
    const employeeData = {
      ...formData,
      skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()).filter(s => s.length > 0) : [],
      education: formData.education ? formData.education.split(",").map((s) => s.trim()).filter(s => s.length > 0) : [],
      recentReviews: formData.recentReviews ? formData.recentReviews.split(",").map((s) => s.trim()).filter(s => s.length > 0) : [],
      achievements: formData.achievements ? formData.achievements.split(",").map((s) => s.trim()).filter(s => s.length > 0) : [],
    };

  
    onSubmit(employeeData);
    
    // Reset form
    resetForm();
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
            <Label htmlFor="employeeId">Employee ID *</Label>
            <Input
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="CTCL001" 
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Input
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              placeholder="e.g., O+"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label>Marital Status</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, maritalStatus: val }))
              }
              value={formData.maritalStatus}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="stateOfOrigin">State of Origin</Label>
            <Input
              id="stateOfOrigin"
              name="stateOfOrigin"
              value={formData.stateOfOrigin}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="lga">LGA</Label>
            <Input 
              id="lga"
              name="lga" 
              value={formData.lga} 
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="bvn">BVN</Label>
            <Input 
              id="bvn"
              name="bvn" 
              value={formData.bvn} 
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="nin">NIN</Label>
            <Input 
              id="nin"
              name="nin" 
              value={formData.nin} 
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Next of Kin */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Next of Kin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nextOfKin">Next of Kin</Label>
            <Input
              id="nextOfKin"
              name="nextOfKin"
              value={formData.nextOfKin}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="nokRelationship">Relationship</Label>
            <Input
              id="nokRelationship"
              name="nokRelationship"
              value={formData.nokRelationship}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="nokAddress">Address</Label>
            <Textarea
              id="nokAddress"
              name="nokAddress"
              value={formData.nokAddress}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="nokPhone">Phone</Label>
            <Input
              id="nokPhone"
              name="nokPhone"
              value={formData.nokPhone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="nokEmail">Email</Label>
            <Input
              id="nokEmail"
              name="nokEmail"
              type="email"
              value={formData.nokEmail}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="bankAccountNumber">Account Number</Label>
            <Input
              id="bankAccountNumber"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Employment Info */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Employment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label>Department</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, department: val }))
              }
              value={formData.department}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Business Development">Business Development</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="joinDate">Join Date</Label>
            <Input
              id="joinDate"
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label>Employee Type</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, employeeType: val }))
              }
              value={formData.employeeType}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Employee Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Intern">Intern</SelectItem>
                <SelectItem value="Consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="manager">Manager</Label>
            <Input
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="workLocation">Work Location</Label>
            <Input
              id="workLocation"
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Pensions and HMO */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Pensions and HMO</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pensionProvider">Pension Provider</Label>
            <Input
              id="pensionProvider"
              name="pensionProvider"
              value={formData.pensionProvider}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="pensionNumber">Pension Number</Label>
            <Input
              id="pensionNumber"
              name="pensionNumber"
              value={formData.pensionNumber}
              onChange={handleChange}
              placeholder="Enter Pension Number"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label>HMO Provider</Label>
            <Select
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, hmoProvider: val }))
              }
              value={formData.hmoProvider}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select HMO Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Leadway HMO">Leadway HMO</SelectItem>
                <SelectItem value="AIICO Multishield">AIICO Multishield</SelectItem>
                <SelectItem value="Hygeia HMO">Hygeia HMO</SelectItem>
                <SelectItem value="Reliance HMO">Reliance HMO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hmoNumber">HMO Number</Label>
            <Input
              id="hmoNumber"
              name="hmoNumber"
              value={formData.hmoNumber}
              onChange={handleChange}
              placeholder="Enter HMO Number"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Skills & Education */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Skills & Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, Project Management, Communication"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="education">Education (comma separated)</Label>
            <Input
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="e.g., BSc Computer Science, MBA"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Performance */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Performance & Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recentReviews">Recent Reviews (comma separated)</Label>
            <Input
              id="recentReviews"
              name="recentReviews"
              value={formData.recentReviews}
              onChange={handleChange}
              placeholder="e.g., Excellent performer, Team player"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="achievements">Achievements (comma separated)</Label>
            <Input
              id="achievements"
              name="achievements"
              value={formData.achievements}
              onChange={handleChange}
              placeholder="e.g., Employee of the month, Project completion"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-sky-600 hover:bg-sky-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Employee..." : "Add Employee"}
        </Button>
      </div>
    </form>
  );
}