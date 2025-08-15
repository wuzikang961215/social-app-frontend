"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page handles legacy profile URLs with IDs
// and redirects them to the main profile page
export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main profile page
    // The profile page shows the current user's profile
    router.replace("/profile");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
  );
}