"use client";

import { useState } from "react";

export function ForgetPasswordDialog() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("New password sent to your email");
        setEmail("");
        setTimeout(() => {
          setShowModal(false);
          setMessage("");
        }, 3000);
      } else {
        setError(data.error || "Failed to send password reset");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setShowModal(false);
    setEmail("");
    setError("");
    setMessage("");
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setShowModal(true)}
        className="text-sm text-blue-600 hover:text-blue-700 underline"
      >
        Forgot Password? (Super Admin Only)
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reset Password</h2>
              <button 
                onClick={resetAndClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              This feature is only available for Super Admin. Enter your registered email to receive a new password.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Super Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="super.admin@company.com"
                  className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600">{message}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Security Notice:</strong> Only the configured Super Admin can use this feature. 
                  A new password will be sent to your email.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="flex-1 border rounded-md px-3 py-2 text-sm disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white rounded-md px-3 py-2 text-sm disabled:opacity-50 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send New Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}