"use client"

import { Tabs, Card, Descriptions, Avatar, Button, Timeline } from "antd"
import { Award, FileText, Edit } from "lucide-react"
import { CustomTag } from "@/components/ui/custom-tag"

const { TabPane } = Tabs

export function EmployeeProfile({ employee }: { employee: any }) {
  const getReliableAvatarUrl = (employee: any) => {
    const idNumber = Number.parseInt(employee.employeeId?.replace(/\D/g, "")) || 1
    const gender = idNumber % 2 === 0 ? "women" : "men"
    const imageNumber = (idNumber % 30) + 1
    return `https://randomuser.me/api/portraits/${gender}/${imageNumber}.jpg`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <Avatar src={getReliableAvatarUrl(employee)} size={96} className="border-2 border-white shadow-lg" />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold">{employee.fullName}</h2>
                <p className="text-gray-500">{employee.position}</p>
                <div className="flex items-center gap-2 mt-2">
                  <CustomTag color={getDepartmentColor(employee.department)}>{employee.department}</CustomTag>
                  <CustomTag color={getStatusColor(employee.status)}>{employee.status}</CustomTag>
                </div>
              </div>
              <Button type="primary" icon={<Edit className="h-4 w-4" />} className="bg-sky-600 hover:bg-sky-700">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultActiveKey="1" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        {/* Personal Information */}
        <TabPane tab="Personal Information" key="1">
          <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Full Name">{employee.fullName}</Descriptions.Item>
            <Descriptions.Item label="Employee ID">{employee.employeeId}</Descriptions.Item>
            <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{employee.phone}</Descriptions.Item>
            <Descriptions.Item label="Date of Birth">{employee.dateOfBirth}</Descriptions.Item>
            <Descriptions.Item label="LGA">{employee.lga}</Descriptions.Item>
            <Descriptions.Item label="Address">{employee.address}</Descriptions.Item>
            <Descriptions.Item label="Emergency Contact">{employee.emergencyContact}</Descriptions.Item>
            <Descriptions.Item label="Blood Group">{employee.bloodGroup}</Descriptions.Item>
            <Descriptions.Item label="Next of Kin">{employee.nextOfKin}</Descriptions.Item>
            <Descriptions.Item label="Next of Kin Address">{employee.nokAddress}</Descriptions.Item>
            <Descriptions.Item label="Next of Kin Phone">{employee.nokPhone}</Descriptions.Item>
            <Descriptions.Item label="Next of Kin Email">{employee.nokEmail}</Descriptions.Item>
            <Descriptions.Item label="Next of Kin Relationship">{employee.nokRelationship}</Descriptions.Item>
            <Descriptions.Item label="BVN">{employee.bvn}</Descriptions.Item>
            <Descriptions.Item label="NIN">{employee.nin}</Descriptions.Item>
            <Descriptions.Item label="Pension Provider">{employee.pensionProvider}</Descriptions.Item>
            <Descriptions.Item label="Pension Number">{employee.pensionNumber}</Descriptions.Item>
            <Descriptions.Item label="Health Insurance">{employee.hmoProvider}</Descriptions.Item>
            <Descriptions.Item label="Health Number">{employee.hmoNumber}</Descriptions.Item>
          </Descriptions>
        </TabPane>

        {/* Employment */}
        <TabPane tab="Employment" key="2">
          <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Job Title">{employee.jobTitle}</Descriptions.Item>
            <Descriptions.Item label="Department">{employee.department}</Descriptions.Item>
            <Descriptions.Item label="Join Date">{employee.joinDate}</Descriptions.Item>
            <Descriptions.Item label="Employee Type">{employee.employmentType}</Descriptions.Item>
            <Descriptions.Item label="Manager">{employee.manager}</Descriptions.Item>
            <Descriptions.Item label="Work Location">{employee.workLocation}</Descriptions.Item>
            <Descriptions.Item label="Salary">{employee.salary}</Descriptions.Item>
            <Descriptions.Item label="Employment Status">{employee.status}</Descriptions.Item>
          </Descriptions>
        </TabPane>

        {/* Skills & Education */}
        <TabPane tab="Skills & Education" key="3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Skills" className="shadow-sm">
              <div className="flex flex-wrap gap-2">
                {employee.skills?.map((skill: string, index: number) => (
                  <CustomTag key={index} color="#3b82f6">
                    {skill}
                  </CustomTag>
                ))}
              </div>
            </Card>

            <Card title="Education" className="shadow-sm">
              <Timeline>
                {employee.education?.map((edu: any, index: number) => (
                  <Timeline.Item key={index}>
                    <div className="font-medium">{edu.degree}</div>
                    <div>{edu.institution}</div>
                    <div className="text-sm text-gray-500">{edu.graduationYear}</div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        </TabPane>

        {/* Documents */}
        <TabPane tab="Documents" key="4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {employee.documents?.map((doc: any, index: number) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-sky-600" />
                  <div>
                    <h4 className="font-medium">{doc.documentName}</h4>
                    <p className="text-xs text-gray-500">Uploaded: {doc.uploadedAt}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button type="link" className="text-sky-600 p-0">
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabPane>

        {/* Performance */}
        <TabPane tab="Performance" key="5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Recent Reviews" className="shadow-sm">
              <Timeline>
                {employee.performanceReviews?.map((review: any, index: number) => (
                  <Timeline.Item key={index} color={getReviewColor(review.rating)}>
                    <div className="font-medium">
                      {review.title} - Rating: {review.rating}/5
                    </div>
                    <div className="text-sm">{review.comments}</div>
                    <div className="text-xs text-gray-500">
                      By: {review.reviewerName} on {review.reviewDate}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>

            <Card title="Achievements" className="shadow-sm">
              <Timeline>
                {employee.achievements?.map((achievement: any, index: number) => (
                  <Timeline.Item key={index} dot={<Award className="h-4 w-4 text-amber-500" />}>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm">{achievement.description}</div>
                    <div className="text-xs text-gray-500">{achievement.date}</div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        </TabPane>
      </Tabs>
    </div>
  )
}

/* Utilities */
function getDepartmentColor(department: string) {
  switch (department) {
    case "Engineering":
      return "#3b82f6"
    case "Marketing":
      return "#f97316"
    case "Human Resources":
      return "#a855f7"
    case "Finance":
      return "#10b981"
    case "Sales":
      return "#ef4444"
    case "Operations":
      return "#06b6d4"
    default:
      return "#6b7280"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Active":
      return "#10b981"
    case "On Leave":
      return "#f97316"
    case "Remote":
      return "#3b82f6"
    default:
      return "#6b7280"
  }
}

function getReviewColor(rating: number) {
  if (rating >= 4) return "#10b981"
  if (rating >= 3) return "#3b82f6"
  if (rating >= 2) return "#f97316"
  return "#ef4444"
}
