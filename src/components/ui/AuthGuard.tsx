"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/register/success', '/register/rejected'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  useEffect(() => {
    // Don't redirect if still loading or on a public route
    if (loading || isPublicRoute) return;
    
    // Check localStorage as a fallback during transitions
    const storedUser = localStorage.getItem('userData');
    
    // Only redirect to login if truly not authenticated
    if (!user && !storedUser) {
      router.push('/login');
    }
  }, [user, loading, router, pathname, isPublicRoute]);
  
  // Show loading spinner while checking auth
  if (loading && !isPublicRoute) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Don't render protected content if not authenticated (except on public routes)
  if (!user && !isPublicRoute) {
    return null;
  }
  
  return <>{children}</>;
}