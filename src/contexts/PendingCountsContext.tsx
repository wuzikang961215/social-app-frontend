"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';
import { hasEventStarted } from '@/lib/dateUtils';
import { useAuth } from './AuthContext';

interface PendingCountsContextType {
  pendingReviewCount: number;
  pendingCheckinCount: number;
  checkPendingReviews: () => Promise<void>;
}

const PendingCountsContext = createContext<PendingCountsContextType | undefined>(undefined);

export function PendingCountsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [pendingCheckinCount, setPendingCheckinCount] = useState(0);

  const checkPendingReviews = useCallback(async () => {
    if (!user?.id) return;

    try {
      console.log('[polling] checking pending reviews from context');
      const res = await api.events.getManageable();
      
      const pendingCount = res.reduce((total: number, event: any) => {
        return total + event.participants.filter((p: any) => p.status === 'pending').length;
      }, 0);
      
      const checkinCount = res.reduce((total: number, event: any) => {
        return total + event.participants.filter((p: any) => 
          p.status === 'approved' && hasEventStarted(event.startTime)
        ).length;
      }, 0);
      
      setPendingReviewCount(pendingCount);
      setPendingCheckinCount(checkinCount);
    } catch (err: any) {
      // Only log error if it's not an authentication issue
      if (!err?.message?.includes('未授权') && !err?.message?.includes('unauthorized')) {
        console.error('Failed to fetch pending reviews:', err);
      }
    }
  }, [user?.id]);

  // Initial fetch when user changes
  useEffect(() => {
    if (user?.id) {
      checkPendingReviews();
    }
  }, [user?.id, checkPendingReviews]);

  // Poll every 30 seconds
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(checkPendingReviews, 30000);
    return () => clearInterval(interval);
  }, [checkPendingReviews, user?.id]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      checkPendingReviews();
    };

    window.addEventListener('refresh-events', handleRefresh);
    return () => {
      window.removeEventListener('refresh-events', handleRefresh);
    };
  }, [checkPendingReviews]);

  return (
    <PendingCountsContext.Provider value={{ pendingReviewCount, pendingCheckinCount, checkPendingReviews }}>
      {children}
    </PendingCountsContext.Provider>
  );
}

export function usePendingCounts() {
  const context = useContext(PendingCountsContext);
  if (context === undefined) {
    throw new Error('usePendingCounts must be used within a PendingCountsProvider');
  }
  return context;
}