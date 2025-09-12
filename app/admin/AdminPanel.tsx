"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
};

export default function AdminPanel() {  
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [checkingAdminStatus, setCheckingAdminStatus] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  // Check super admin status on component mount
  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      try {
        const response = await fetch('/api/auth/check-super-admin');
        const data = await response.json();
        setIsSuperAdmin(data.isSuperAdmin);
      } catch (error) {
        console.error('Error checking super admin status:', error);
        setIsSuperAdmin(false);
      } finally {
        setCheckingAdminStatus(false);
      }
    };

    if (session?.user?.email) {
      checkSuperAdminStatus();
    } else {
      setCheckingAdminStatus(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  const toggleActive = async (id: string, status: boolean) => {
    await fetch("/api/admin/toggle-user", {
      method: "POST",
      body: JSON.stringify({ userId: id, isActive: status }),
      headers: { "Content-Type": "application/json" },
    });
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isActive: status } : u))
    );
  };

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createUser() {
    await fetch("/api/admin/create-user", {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", password: "", role: "admin" });
    load();
  }

  async function changePassword(email: string) {
    const newPassword = prompt(`New password for ${email}?`);
    if (!newPassword) return;

    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Password updated. User must log in again.");
      load();
    } else {
      alert(data.error || "Failed to update password");
    }
  }

  // Function to mask email for non-super admins
  const maskEmail = (email: string) => {
    if (isSuperAdmin) return email;
    
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}`
      : `${'*'.repeat(username.length)}`;
    const maskedDomain = domain.length > 4
      ? `${domain.substring(0, 2)}${'*'.repeat(domain.length - 4)}${domain.substring(domain.length - 2)}`
      : `${'*'.repeat(domain.length)}`;
    
    return `${maskedUsername}@${maskedDomain}`;
  };

  return (
    <div className="space-y-8">
      {/* Show loading while checking admin status */}
      {checkingAdminStatus ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-600">Checking access permissions...</p>
        </div>
      ) : (
        <>
          {/* Role indicator */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Access Level:</span> {isSuperAdmin ? 'Super Admin (Full Access)' : 'Admin (Limited Access)'}
            </p>
            {isSuperAdmin && (
              <p className="text-xs text-blue-600 mt-1">
                Verified as Super Admin: {session?.user?.email}
              </p>
            )}
            {!isSuperAdmin && (
              <p className="text-xs text-blue-600 mt-1">
                Some information is hidden for security. Contact Super Admin for full access.
              </p>
            )}
          </div>

          {/* Create New User - Only for Super Admin */}
          {isSuperAdmin && (
            <section className="bg-white border rounded-xl p-4">
              <h2 className="font-semibold mb-3">Create New User</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className="border rounded px-3 py-2"
                  placeholder="Password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <select
                  className="border rounded px-3 py-2"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button 
                onClick={createUser} 
                className="mt-3 border text-white rounded px-6 py-2 bg-green-500 hover:bg-green-600"
              >
                Create
              </button>
            </section>
          )}

          {/* User list */}
          <section className="bg-white border rounded-xl p-4">
            <h2 className="font-semibold mb-3">Users</h2>
            {loading ? (
              <p>Loading…</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="text-left border-b">
                      {isSuperAdmin && <TableHead className="p-2">Name</TableHead>}
                      <TableHead className="p-2">Email</TableHead>
                      <TableHead className="p-2">Role</TableHead>
                      <TableHead className="p-2">Status</TableHead>
                      <TableHead className="p-2">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u._id} className="border-b">
                        {/* Only show name for super admin */}
                        {isSuperAdmin && (
                          <TableCell className="p-2">{u.name}</TableCell>
                        )}
                        
                        {/* Show masked email for regular admin, full email for super admin */}
                        <TableCell className="p-2">
                          {maskEmail(u.email)}
                        </TableCell>
                        
                        <TableCell className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            u.email === session?.user?.email && isSuperAdmin
                              ? 'bg-purple-100 text-purple-800' 
                              : u.role === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {u.email === session?.user?.email && isSuperAdmin ? 'Super Admin' : 
                             u.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </TableCell>
                        
                        <TableCell className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            u.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        
                        <TableCell className="p-2">
                          <div className="flex space-x-2">
                            {/* Only super admin can manage users */}
                            {isSuperAdmin ? (
                              <>
                                {/* Don't allow deactivating super admin (self) */}
                                {u.email !== session?.user?.email && (
                                  <button
                                    className={`border rounded px-2 py-1 text-xs ${
                                      u.isActive
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                                    onClick={() => toggleActive(u._id, !u.isActive)}
                                  >
                                    {u.isActive ? "Deactivate" : "Activate"}
                                  </button>
                                )}
                                
                                <button
                                  className="border rounded px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600"
                                  onClick={() => changePassword(u.email)}
                                >
                                  Change Password
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500 italic">
                                Super Admin Only
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </section>

          {/* Show limited access message for regular admins */}
          {!isSuperAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Limited Access Notice</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• User creation is disabled</li>
              </ul>
              <p className="text-xs text-yellow-600 mt-2">
                Contact the Super Administrator to request additional permissions.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}