"use client";
import { Employee, EmployeeFormData } from "@/types/employee";
import { useState, useEffect, useRef } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/employees");
      if (!res.ok) {
        throw new Error(`Failed to fetch employees: ${res.status}`);
      }
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch employees");
    } finally {
      setIsLoading(false);
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


  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  

  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isUpdatingEmployee, setIsUpdatingEmployee] = useState(false);
  const [isDeletingEmployee, setIsDeletingEmployee] = useState(false);


  const submissionInProgress = useRef(false);

 
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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

  const filteredData = employees.filter((employee) => {
   
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

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filters]);

  //page paginatiooooonnn
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddEmployee = async (employee: EmployeeFormData) => {
   
    if (isAddingEmployee || submissionInProgress.current) {
     
      return;
    }
    
    try {
      setIsAddingEmployee(true);
      submissionInProgress.current = true;
      
      console.log("Starting employee creation for:", employee.fullName);
      
      if (!employee.fullName || !employee.email) {
        toast({
          title: "Validation Error",
          description: "Full Name and Email are required.",
          variant: "destructive",
        });
        return;
      }

      
      const { _id, ...employeeData } = employee;
      
      // console.log("Sending employee data (without _id):", employeeData);
      
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        
       
        let errorMessage = data?.error || data?.message || `Server error: ${res.status}`;
        
        if (errorMessage.includes('E11000') && errorMessage.includes('employeeId')) {
          errorMessage = "Employee ID already exists. Please try again as a new ID will be generated.";
        } else if (errorMessage.includes('E11000') && errorMessage.includes('email')) {
          errorMessage = "An employee with this email address already exists.";
        } else if (errorMessage.includes('E11000')) {
          errorMessage = "This employee information already exists in the system.";
        }
        
        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log("Employee created successfully:", result);

      await fetchEmployees();
      setAddDialogOpen(false);
      toast({
        title: "Employee Added",
        description: `${employee.fullName} has been added successfully.`,
      });
    } catch (error) {
      console.error("Add employee error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add employee";
      toast({
        title: "Error Adding Employee",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingEmployee(false);
      submissionInProgress.current = false;
    }
  };

  const updateEmployee = async (employee: EmployeeFormData) => {
    if (!employee._id) throw new Error("Employee ID is missing");
    const res = await fetch(`/api/employees/${employee._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to update employee");
    }
    return res.json();
  };

  const handleEditEmployee = async (employee: EmployeeFormData) => {
    
    if (isUpdatingEmployee) return;
    
    try {
      setIsUpdatingEmployee(true);
      await updateEmployee(employee);
      await fetchEmployees();
      setEditDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "Employee Updated",
        description: `${employee.fullName}'s info has been updated.`,
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update employee",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingEmployee(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee?._id || isDeletingEmployee) return;
    
    try {
      setIsDeletingEmployee(true);
      const res = await fetch(`/api/employees/${selectedEmployee._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete employee");
      }
      await fetchEmployees();
      setDeleteDialogOpen(false);
      toast({
        title: "Employee Deleted",
        description: `${selectedEmployee.fullName} has been removed from the directory.`,
        variant: "destructive",
      });
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete employee",
        variant: "destructive",
      });
    } finally {
      setIsDeletingEmployee(false);
    }
  };

  const openViewDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setViewDialogOpen(true);
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      toast({
        title: "No Data",
        description: "No employees to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      
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
        const str = String(value).replace(/"/g, '""'); 
        return `"${str}"`; 
      };

      const csvContent = [
        headers.map(escapeCSV).join(","), 
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

      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `employees_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); 

      toast({
        title: "Export Successful",
        description: `${filteredData.length} employee records exported to CSV.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export employee data.",
        variant: "destructive",
      });
    }
  };

 
  if (error && !isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <Search className="h-12 w-12 mx-auto mb-2" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Error Loading Employees
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={fetchEmployees} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
            disabled={isLoading || filteredData.length === 0}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Spin size="small" />
                    <p className="text-sm mt-2">Loading employees...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((employee, index) => (
                <TableRow
                  key={employee._id || employee.employeeId || `employee-${index}`}
                >
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2 border">
                        <AvatarImage
                          // src={employee.avatar || "/placeholder.svg"}
                          alt={employee.fullName || "Employee"}
                        />
                        <AvatarFallback>
                          {employee.fullName?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/dashboard/employees/${employee._id}`}
                        className="hover:text-green-600 hover:underline"
                      >
                        <span className="font-medium">{employee.fullName}</span>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getDepartmentColor(employee.department || "")}
                    >
                      {employee.department}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(employee.status || "")}
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
                    <Search className="h-10 w-10 mb-2" />
                    <p>No employees found</p>
                    <p className="text-sm">
                      {searchText ||
                      filters.department !== "all" ||
                      filters.status !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first employee"}
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
              {searchText && ` (filtered from ${employees.length} total)`}
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
      <Dialog 
        open={addDialogOpen} 
        onOpenChange={(open) => {
         
          if (!open && isAddingEmployee) return;
          setAddDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <AddEmployeeForm
            onSubmit={handleAddEmployee}
            onCancel={() => setAddDialogOpen(false)}
            isSubmitting={isAddingEmployee}
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
              disabled={isDeletingEmployee}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isDeletingEmployee ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}