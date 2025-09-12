"use client"

import { useEffect, useState } from "react"
import { Card, Avatar, List } from "antd"
import Link from "next/link"

export function RecentEmployees() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentEmployees() {
      try {
        const res = await fetch("/api/employees/recent")
        const data = await res.json()
        setEmployees(data)
      } catch (error) {
        console.error("Failed to fetch recent employees:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRecentEmployees()
  }, [])

  return (
    <Card
      title="Recently Joined Employees"
      className="shadow-sm hover:shadow-md transition-shadow h-full"
    >
      <List
        itemLayout="horizontal"
        dataSource={employees}
        loading={loading}
        renderItem={(employee) => (
          <List.Item key={employee._id}>
            <List.Item.Meta
              avatar={<Avatar src={employee.avatar || "/placeholder.svg?height=40&width=40"} />}
              title={
                <Link
                  href={`/dashboard/employees/${employee._id}`}
                  className="text-sky-600 hover:underline"
                >
                  {employee.fullName}   {/* ✅ use fullName instead of name */}
                </Link>
              }
              description={
                <div className="text-xs">
                  <p>
                    {employee.position || "—"} • {employee.department || "—"}
                  </p>
                  <p className="text-gray-500">
                    Joined:{" "}
                    {employee.joinDate
                      ? new Date(employee.joinDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  )
}
