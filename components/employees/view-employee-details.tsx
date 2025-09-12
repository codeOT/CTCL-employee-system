"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building,
  User,
  Globe,
  DollarSign,
  FileBadge,
  GraduationCap,
  HeartPulse,
  Shield,
  Landmark,
  Contact,
  Hospital,
  IdCard,
} from "lucide-react";

interface ViewEmployeeDetailsProps {
  employee: any;
}

export function ViewEmployeeDetails({ employee }: ViewEmployeeDetailsProps) {
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Marketing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "Human Resources":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "Finance":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Business Development":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Operations":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={employee.avatar || "/placeholder.svg"}
              alt={employee.name}
            />
            {/* <AvatarFallback className="text-2xl">
              {employee.name.charAt(0)}
            </AvatarFallback> */}
          </Avatar>
        </div>

        <div className="flex-grow">
          <h2 className="text-2xl font-bold">{employee.fullName}</h2>
          <p className="text-muted-foreground">{employee.position}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              variant="outline"
              className={getDepartmentColor(employee.department)}
            >
              {employee.department}
            </Badge>
            <Badge
              variant="outline"
              
            >
              {employee.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{employee.email}</span>
            </div>

            {employee.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined: {employee.joinDate}</span>
            </div>

            {employee.employeeId && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>ID: {employee.employeeId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="documents">Documents & Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.birthDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date of Birth</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.birthDate}
                      </p>
                    </div>
                  </div>
                )}

                {employee.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.address}
                      </p>
                    </div>
                  </div>
                )}

                {employee.maritalStatus && (
                  <div className="flex items-start gap-2">
                    <HeartPulse className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Marital Status</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.maritalStatus}
                      </p>
                    </div>
                  </div>
                )}

                {employee.emergencyContact && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Emergency Contact</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.emergencyContact}
                      </p>
                    </div>
                  </div>
                )}

                {employee.bloodGroup && (
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center text-muted-foreground mt-0.5">
                      <span className="text-xs font-bold">B+</span>
                    </div>
                    <div>
                      <p className="font-medium">Blood Group</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.bloodGroup}
                      </p>
                    </div>
                  </div>
                )}

                {employee.stateOfOrigin && (
                  <div className="flex items-start gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">State of Origin</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.stateOfOrigin}
                      </p>
                    </div>
                  </div>
                )}

                {employee.lga && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">LGA</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.lga}
                      </p>
                    </div>
                  </div>
                )}

                {employee.bvn && (
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">BVN</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.bvn}
                      </p>
                    </div>
                  </div>
                )}

                {employee.nin && (
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">NIN</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.nin}
                      </p>
                    </div>
                  </div>
                )}

                {/* Next of Kin Section */}
                {employee.nextOfKin && (
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Next of Kin</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.nextOfKin}
                      </p>
                    </div>
                  </div>
                )}
                {employee.nokPhone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Next of Kin Phone Number</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.nokPhone}
                      </p>
                    </div>
                  </div>
                )}
                {employee.nokEmail && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Next of Kin Email Address</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.nokEmail}
                      </p>
                    </div>
                  </div>
                )}
                {employee.nokAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Next of Kin Address</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.nokAddress}
                      </p>
                    </div>
                  </div>
                )}
                {employee.nokRelationship && (
                  <div className="flex items-start gap-2">
                    <Contact className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Next of Kin Relationship</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.nokRelationship}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Position</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.position}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.department}
                    </p>
                  </div>
                </div>

                {employee.employeeType && (
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Employee Type</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.employeeType}
                      </p>
                    </div>
                  </div>
                )}

                {employee.manager && (
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Manager</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.manager}
                      </p>
                    </div>
                  </div>
                )}

                {employee.workLocation && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Work Location</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.workLocation}
                      </p>
                    </div>
                  </div>
                )}

                {employee.joinDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Join Date</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.joinDate}
                      </p>
                    </div>
                  </div>
                )}

                {employee.salary && (
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center text-muted-foreground mt-0.5">
                      <span className="text-xs font-bold">$</span>
                    </div>
                    <div>
                      <p className="font-medium">Salary</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.salary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pension */}
                {employee.pensionProvider && (
                  <div className="flex items-start gap-2">
                    <Landmark className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Pension Provider</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.pensionProvider}
                      </p>
                    </div>
                  </div>
                )}
                {employee.pensionNumber && (
                  <div className="flex items-start gap-2">
                    <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Pension Number</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.pensionNumber}
                      </p>
                    </div>
                  </div>
                )}

                {/* HMO */}
                {employee.hmoProvider && (
                  <div className="flex items-start gap-2">
                    <Hospital className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">HMO Provider</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.hmoProvider}
                      </p>
                    </div>
                  </div>
                )}
                {employee.hmoNumber && (
                  <div className="flex items-start gap-2">
                    <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">HMO Number</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.hmoNumber}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bank Info */}
                {employee.bankName && (
                  <div className="flex items-start gap-2">
                    <Landmark className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Bank Name</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.bankName}
                      </p>
                    </div>
                  </div>
                )}
                {employee.bankAccountNumber && (
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Bank Account No.</p>
                      <p className="text-sm text-muted-foreground">
                        {employee.bankAccountNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      

        <TabsContent value="documents" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employee.skills && employee.skills.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.documents && employee.documents.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Documents</h3>
                  <div className="space-y-3">
                    {employee.documents.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-md border"
                      >
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div className="flex-grow">
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded: {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.education && employee.education.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Education</h3>
                  <div className="space-y-4">
                    {employee.education.map((edu: any, index: number) => (
                      <div
                        key={index}
                        className="border-l-2 border-blue-500 pl-4"
                      >
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">
                          {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.achievements && employee.achievements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                  <div className="space-y-4">
                    {employee.achievements.map(
                      (achievement: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm">{achievement.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {achievement.date}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* Helper sub-component for cleaner rendering */
function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-5 w-5 text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}
