"use client";
import { Employee, EmployeeFormData } from "@/types/employee";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spin } from "antd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLayout } from "@/components/layout/layout-provider";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddEmployeeForm } from "@/components/employees/add-employee-form";
import { EditEmployeeForm } from "@/components/employees/edit-employee-form";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ViewEmployeeDetails } from "@/components/employees/view-employee-details";
import Link from "next/link";

export function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const { toast } = useToast();
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    department: "all",
    status: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Selected employee for operations
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Legal":
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "On Leave":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "Inactive":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "Terminated":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Resigned":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Remote":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Use employees from context if available, otherwise use mock data
  const employeeData = employees.length > 0 ? employees : [];

  const filteredData = employeeData.filter((employee) => {
    // Search functionality - check multiple fields
    const matchesSearch =
      searchText === "" ||
      employee.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.employeeId?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchText.toLowerCase());

    const matchesDepartment =
      filters.department === "all" ||
      employee.department === filters.department;
    const matchesStatus =
      filters.status === "all" || employee.status === filters.status;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddEmployee = async (employee: EmployeeFormData) => {
    try {
      if (!employee.fullName || !employee.email) {
        toast({
          title: "Validation Error",
          description: "Full Name and Email are required.",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee), // backend creates employeeId and coerces reviews
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to add employee");
      }

      await fetchEmployees();
      setAddDialogOpen(false);
      toast({
        title: "Employee Added",
        description: `${employee.fullName} has been added.`,
      });
    } catch (error: any) {
      console.error("Add employee error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Function to update an employee
  const updateEmployee = async (employee: EmployeeFormData) => {
    if (!employee._id) throw new Error("Employee ID is missing");
    const res = await fetch(`/api/employees/${employee._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error("Failed to update employee");
    return res.json();
  };

  const handleEditEmployee = async (employee: EmployeeFormData) => {
    try {
      await updateEmployee(employee);
      await fetchEmployees();
      setEditDialogOpen(false);
      toast({
        title: "Employee Updated",
        description: `${employee.fullName}'s info has been updated.`,
      });
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee?._id) return;
    try {
      const res = await fetch(`/api/employees/${selectedEmployee._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete employee");
      await fetchEmployees();
      setDeleteDialogOpen(false);
      toast({
        title: "Employee Deleted",
        description: `${selectedEmployee.fullName} has been removed from the directory.`,
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openViewDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  };

  const openEditDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = [
      "ID",
      "Name",
      "Position",
      "Department",
      "Email",
      "Phone",
      "Join Date",
      "Status",
      "Employee Type",
      "Date of Birth",
      "Address",
      "Marital Status",
      "Emergency Contact",
      "Blood Group",
      "Next of Kin",
      "State of Origin",
      "LGA",
      "BVN",
      "NIN",
      "NOK Address",
      "NOK Phone",
      "NOK Email",
      "NOK Relationship",
      "Bank Name",
      "Bank Account Number",
      "Pension Number",
      "Pension Provider",
      "HMO Number",
      "HMO Provider",
      "Skills",
      "Education",
      "Achievements",
    ];

    const escapeCSV = (value: string | number | null | undefined): string => {
      if (value === null || value === undefined) return "";
      const str = String(value).replace(/"/g, '""'); // escape quotes
      return `"${str}"`; // wrap in quotes
    };

    const csvContent = [
      headers.map(escapeCSV).join(","), // header row
      ...filteredData.map((employee) => {
        return [
          employee.employeeId,
          employee.fullName,
          employee.position,
          employee.department,
          employee.email,
          employee.phone,
          employee.joinDate,
          employee.status,
          employee.employeeType,
          employee.dateOfBirth,
          employee.address,
          employee.maritalStatus,
          employee.emergencyContact,
          employee.bloodGroup,
          employee.nextOfKin,
          employee.stateOfOrigin,
          employee.lga,
          employee.bvn,
          employee.nin,
          employee.nokAddress,
          employee.nokPhone,
          employee.nokEmail,
          employee.nokRelationship,
          employee.bankName,
          employee.bankAccountNumber,
          employee.pensionNumber,
          employee.pensionProvider,
          employee.hmoNumber,
          employee.hmoProvider,
          (employee.skills || []).join("; "),
          (employee.education || []).join("; "),
          (employee.achievements || []).join("; "),
        ]
          .map(escapeCSV)
          .join(",");
      }),
    ].join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `${filteredData.length} employee records exported to CSV.`,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 w-full md:w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select
              value={filters.department}
              onValueChange={(value) =>
                setFilters({ ...filters, department: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Business Development">
                  Business Development
                </SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
                <SelectItem value="Resigned">Resigned</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            className="bg-sky-600 hover:bg-sky-700"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Employee
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((employee: any, index: number) => (
                <TableRow
                  key={
                    employee._id || employee.employeeId || `employee-${index}`
                  }
                >
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2 border">
                        <AvatarImage
                          src={employee.avatar || "/placeholder.svg"}
                          alt={employee.fullName}
                        />
                        <AvatarFallback>
                          {employee.fullName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/dashboard/employees/${employee._id}`}
                        className=" hover:text-green-600 hover:underline"
                      >
                        <span className="font-medium">{employee.fullName}</span>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getDepartmentColor(employee.department)}
                    >
                      {employee.department}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(employee.status)}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => openViewDialog(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600"
                        onClick={() => openEditDialog(employee)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => openDeleteDialog(employee)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    {/* <Search className="h-10 w-10 mb-2" /> */}{" "}
                    <Spin size="small" />
                    {/* <p>No employees found</p> */}
                    <p className="text-sm">
                      {searchText ||
                      filters.department !== "all" ||
                      filters.status !== "all"
                        ? "Try adjusting your search or filters"
                        : "Loading employees..."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length} entries
              {searchText && ` (filtered from ${employeeData.length} total)`}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum = i + 1;

                  // If we have more than 5 pages and we're not at the beginning
                  if (totalPages > 5 && currentPage > 3) {
                    if (i === 0) {
                      pageNum = 1;
                    } else if (i === 1) {
                      return (
                        <PaginationItem key="ellipsis-start">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    } else {
                      pageNum = Math.min(
                        totalPages - (4 - i),
                        currentPage + (i - 2)
                      );
                    }
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {totalPages > 5 && currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      {/* Add Employee Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px] h-full ">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <AddEmployeeForm
            onSubmit={handleAddEmployee}
            onCancel={() => setAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <ViewEmployeeDetails employee={selectedEmployee} />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] ">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <EditEmployeeForm
              employee={selectedEmployee}
              onSubmit={handleEditEmployee}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {selectedEmployee?.fullName}'s record and remove their data from
              the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
