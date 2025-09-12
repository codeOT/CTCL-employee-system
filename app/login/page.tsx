"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ForgetPasswordDialog } from "@/components/ForgetPasswordDialog";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Approval polling states
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  // Poll for approval status
  useEffect(() => {
    if (!isWaitingForApproval || !currentUserId) {
      console.log('Polling not started:', { isWaitingForApproval, currentUserId });
      return;
    }

    console.log('Starting polling for user:', currentUserId);
    
    const pollInterval = setInterval(async () => {
      try {
        console.log('Polling for user:', currentUserId);
        const response = await fetch(`/api/auth/check-approval?userId=${currentUserId}`);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        // Get the response as text first to see what we're receiving
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        if (!response.ok) {
          console.log('Non-OK response:', response.status, responseText);
          return; // Continue polling even on error
        }
        
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.log('Response was not JSON:', responseText);
          return;
        }
        
        console.log('Polling response:', data);
        
        if (data.approved) {
          setApprovalMessage('✅ Email approved! You can now sign in.');
          setIsWaitingForApproval(false);
          setErr(null);
          clearInterval(pollInterval);
          
          // Show success message for 3 seconds then clear
          setTimeout(() => {
            setApprovalMessage('');
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking approval:', error);
        // Don't stop polling on error, just log it
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [isWaitingForApproval, currentUserId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setApprovalMessage('');
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    
    setLoading(false);
    
    if (!res) return setErr("Unexpected error");
    
    if (res.error) {
      console.log('Login error:', res.error);
      
      // Check if it's an approval pending error
      if (res.error.includes('Awaiting Admin approval')) {
        console.log('Detected approval pending error');
        
        // Check if user ID is embedded in error message
        const errorParts = res.error.split('|');
        console.log('Error parts:', errorParts);
        
        if (errorParts.length > 1) {
          // User ID is embedded in error
          console.log('Found embedded user ID:', errorParts[1]);
          setCurrentUserId(errorParts[1]);
          setIsWaitingForApproval(true);
          setErr("Your account is pending approval. Please wait...");
        } else {
          // Fallback to API call
          console.log('Falling back to API call for user ID');
          try {
            const userResponse = await fetch('/api/auth/get-user-id', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });
            
            console.log('User ID API response status:', userResponse.status);
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              console.log('User data from API:', userData);
              setCurrentUserId(userData.userId);
              setIsWaitingForApproval(true);
              setErr("Your account is pending approval. Please wait...");
            } else {
              const errorData = await userResponse.json();
              console.log('User ID API error:', errorData);
              setErr(errorParts[0] || res.error);
            }
          } catch (error) {
            console.error('Error getting user ID:', error);
            setErr(errorParts[0] || res.error);
          }
        }
      } else {
        setErr(res.error);
      }
      return;
    }
    
    router.push(res.url || "/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 p-6 m-auto"
      >
        <Image
          src="/ct1.png"
          alt="EMS"
          width="500"
          height="500"
          className="rounded-xl mb-12"
        />
        <div className="border rounded-xl p-6 space-y-7 shadow-lg">
          <h1 className="text-2xl font-bold">Sign in</h1>
          
        
          
          {/* Approval Status Messages */}
          {isWaitingForApproval && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
                <p className="text-sm text-yellow-800">
                  Waiting for admin approval... Please check your email or wait for confirmation.
                </p>
              </div>
            </div>
          )}
          
          {approvalMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">{approvalMessage}</p>
            </div>
          )}
          
          <div className="space-y-1">
            <label className="block text-sm">Email</label>
            <input
              className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              disabled={loading || isWaitingForApproval}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm">Password</label>
            <input
              className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading || isWaitingForApproval}
              required
            />
          </div>
          
          <button
            disabled={loading || isWaitingForApproval}
            className="w-full rounded-md border px-3 py-2 font-medium disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : 
             isWaitingForApproval ? "Waiting for Approval..." : 
             "Sign in"}
          </button>

          {/* Forget Password Link */}
          <div className="text-center">
            <ForgetPasswordDialog />
          </div>
        </div>
      </form>
      <div className="bg-[url('/co.jpg')] bg-cover bg-center w-full h-[100vh] hidden md:block"></div>
    </main>
  );
}