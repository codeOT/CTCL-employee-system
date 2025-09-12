"use client"

import { useEffect, useState } from "react"
import { Card, Spin } from "antd"
import dynamic from "next/dynamic"
import { DoughnutChart, type DoughnutChartProps } from "@/components/ui/chart"

// Dynamically import the chart to avoid SSR issues
const Chart = dynamic(() => Promise.resolve(DoughnutChart), { ssr: false })

export function DepartmentDistribution() {
  const [chartData, setChartData] = useState<DoughnutChartProps | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/employees")
        const employees = await res.json()

        // ✅ Count employees by department
        const departmentCounts: Record<string, number> = {}
        employees.forEach((emp: any) => {
          const dept = emp.department || "Unassigned"
          departmentCounts[dept] = (departmentCounts[dept] || 0) + 1
        })

        const labels = Object.keys(departmentCounts)
        const data = Object.values(departmentCounts)

        setChartData({
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: [
                  "rgba(14, 165, 233, 0.7)", // sky
                  "rgba(249, 115, 22, 0.7)", // orange
                  "rgba(139, 92, 246, 0.7)", // purple
                  "rgba(16, 185, 129, 0.7)", // green
                  "rgba(245, 158, 11, 0.7)", // amber
                  "rgba(239, 68, 68, 0.7)", // red
                  "rgba(99, 102, 241, 0.7)", // indigo (extra if more depts)
                  "rgba(34, 197, 94, 0.7)", // emerald
                ],
                borderColor: [
                  "rgba(14, 165, 233, 1)",
                  "rgba(249, 115, 22, 1)",
                  "rgba(139, 92, 246, 1)",
                  "rgba(16, 185, 129, 1)",
                  "rgba(245, 158, 11, 1)",
                  "rgba(239, 68, 68, 1)",
                  "rgba(99, 102, 241, 1)",
                  "rgba(34, 197, 94, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "right",
              },
            },
            cutout: "60%",
          },
        })
      } catch (error) {
        console.error("Failed to fetch department data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  return (
    <Card
      title="Department Distribution"
      className="shadow-sm hover:shadow-md transition-shadow h-full"
    >
      {loading ? <Spin /> : chartData ? <Chart {...chartData} /> : <p>No data available</p>}
    </Card>
  )
}
