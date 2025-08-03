"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // No padding for auth pages
  const authPages = ['/login', '/register', '/forgot-password'];
  const needsPadding = !authPages.includes(pathname);
  
  return (
    <div className={needsPadding ? "pb-16" : ""}>
      {children}
    </div>
  );
}