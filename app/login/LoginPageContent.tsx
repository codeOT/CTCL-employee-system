// app/login/LoginPageContent.tsx
"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ForgetPasswordDialog } from "@/components/ForgetPasswordDialog";
import { useToast } from "@/hooks/use-toast";

export default function LoginPageContent() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Approval polling states
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  // Poll for approval status with enhanced notifications
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
        
        if (!response.ok) {
          console.log('Non-OK response:', response.status);
          return; // Continue polling even on error
        }
        
        const data = await response.json();
        console.log('Polling response data:', data);
        
        // Check for approval
        if (data.approved) {
          console.log('User approved!');
          setApprovalMessage('Access Approved! You can now sign in.');
          setIsWaitingForApproval(false);
          setErr(null);
          clearInterval(pollInterval);
          
          // Show success toast
          toast({
            title: "Access Approved!",
            description: "Your login access has been approved. You can now sign in.",
          });
          
          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Access Approved!', {
              body: 'Your login access has been approved. You can now sign in.',
              icon: '/favicon.ico'
            });
          }
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            setApprovalMessage('');
          }, 5000);
        } 
        // Check for decline - more explicit checking
        else if (data.declined || (data.loginApproved === false && data.approvalPending === false && data.declinedAt)) {
          console.log('User declined!');
          setApprovalMessage('Access Declined. Please contact your administrator.');
          setIsWaitingForApproval(false);
          setErr('Your access request has been declined.');
          clearInterval(pollInterval);
          
          // Show error toast
          toast({
            title: "Access Declined",
            description: "Your login access request has been declined. Contact your administrator.",
            variant: "destructive",
          });
          
          // Show decline notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Access Declined', {
              body: 'Your login access request has been declined.',
              icon: '/favicon.ico'
            });
          }
          
          // Keep decline message visible longer (10 seconds)
          setTimeout(() => {
            setApprovalMessage('');
            setErr(null);
          }, 10000);
        }
        // Still pending
        else if (data.approvalPending) {
          console.log('Still pending approval...');
          // Continue polling
        }
        else {
          console.log('Unexpected state:', data);
        }
      } catch (error) {
        console.error('Error checking approval:', error);
        // Don't stop polling on error, just log it
      }
    }, 3000); // Poll every 3 seconds

    // Request notification permission when polling starts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    return () => clearInterval(pollInterval);
  }, [isWaitingForApproval, currentUserId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setApprovalMessage('');
    
    // Show loading toast
    toast({
      title: "Logging in",
      description: "Please wait while we authenticate your credentials...",
    });
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    
    setLoading(false);
    
    if (!res) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return setErr("Unexpected error");
    }
    
    if (res.error) {
      console.log('Login error:', res.error);
      
      // Check if it's an approval pending error
      if (res.error.includes('Awaiting Admin approval')) {
        console.log('Detected approval pending error');
        console.log('Full error message:', res.error);
        
        // Show pending approval toast
        toast({
          title: "Approval Required",
          description: "Your account is pending approval. Please wait for administrator confirmation.",
        });
        
        // Check if user ID is embedded in error message
        const errorParts = res.error.split('|');
        console.log('Error parts:', errorParts);
        console.log('Error parts length:', errorParts.length);
        
        if (errorParts.length > 1) {
          // User ID is embedded in error
          const extractedUserId = errorParts[1];
          console.log('Found embedded user ID:', extractedUserId);
          console.log('User ID type:', typeof extractedUserId);
          console.log('User ID length:', extractedUserId.length);
          
          setCurrentUserId(extractedUserId);
          setIsWaitingForApproval(true);
          setErr("Your account is pending approval. Please wait...");
        } else {
          console.log('No user ID in error message, falling back to API call');
          // Fallback to API call
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
        // Show login error toast
        toast({
          title: "Login Failed",
          description: res.error === "Invalid credentials" ? "Invalid email or password" : res.error,
          variant: "destructive",
        });
        setErr(res.error);
      }
      return;
    }
    
    // Show success toast and redirect
    toast({
      title: "Welcome!",
      description: "Login successful. Redirecting to dashboard...",
    });
    
    setTimeout(() => {
      router.push(res.url || "/dashboard");
    }, 500); // Small delay to show the success toast
  }

  return (
    <main className="min-h-screen h-screen flex items-center overflow-hidden">
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
        <div className="border rounded-xl p-6 space-y-1 shadow-lg min-h-[400px] flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          
          {/* Fixed height container for messages */}
          <div className="min-h-[60px]">
            {/* Error Messages */}
            {err && !approvalMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{err}</p>
              </div>
            )}
            
            {/* Approval Status Messages */}
            {/* {isWaitingForApproval && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
                  <p className="text-sm text-yellow-800">
                    Waiting for admin approval... Please contact Admin for updates.
                  </p>
                </div>
              </div>
            )}
             */}
            {/* Success/Decline Messages */}
            {approvalMessage && (
              <div className={`p-3 border rounded-md ${
                approvalMessage.includes('Approved') 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm ${
                  approvalMessage.includes('Approved') 
                    ? 'text-green-800' 
                    : 'text-red-800'
                }`}>
                  {approvalMessage.includes('Approved') && '✅ '}
                  {approvalMessage.includes('Declined') && '❌ '}
                  {approvalMessage}
                </p>
                {approvalMessage.includes('Approved') && (
                  <p className="text-xs text-green-600 mt-1">
                    You can now enter your credentials and sign in.
                  </p>
                )}
                {approvalMessage.includes('Declined') && (
                  <p className="text-xs text-red-600 mt-1">
                    Contact your system administrator for assistance.
                  </p>
                )}
              </div>
            )}
          </div>
       
          
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