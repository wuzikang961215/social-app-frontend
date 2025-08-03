import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { hasEventStarted } from '@/lib/dateUtils';
import { useAuth } from '@/contexts/AuthContext';

interface UserInfo {
  id: string;
  username: string;
  idealBuddy?: string;
  interests?: string[];
  whyJoin?: string;
}

export function useUserInfo() {
  const router = useRouter();
  const { user: authUser, token } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  const [pendingCheckinCount, setPendingCheckinCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user data and related events
  const fetchUserData = useCallback(async () => {
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all user-related data in parallel
      const [userRes, createdRes, joinedRes, manageRes] = await Promise.all([
        api.user.getProfile(),
        api.events.getCreated(),
        api.events.getJoined(),
        api.events.getManageable()
      ]);

      setUserInfo(userRes.data);
      setCreatedEvents(createdRes.data);
      setJoinedEvents(joinedRes.data);

      // Calculate pending review count
      const pendingCount = manageRes.data.reduce((total: number, event: any) => {
        return total + event.participants.filter((p: any) => p.status === 'pending').length;
      }, 0);
      setPendingReviewCount(pendingCount);

      // Calculate pending check-in count
      const checkinCount = manageRes.data.reduce((total: number, event: any) => {
        return total + event.participants.filter((p: any) => 
          p.status === 'approved' && hasEventStarted(event.startTime)
        ).length;
      }, 0);
      setPendingCheckinCount(checkinCount);

      setError(null);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError(err as Error);
      
      if (err instanceof Error && err.message.includes('Token')) {
        router.replace('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router, token]);

  // Check for pending reviews (with polling)
  const checkPendingReviews = useCallback(async () => {
    if (!userInfo?.id) return;

    try {
      const res = await api.events.getManageable();
      const pendingCount = res.data.reduce((total: number, event: any) => {
        return total + event.participants.filter((p: any) => p.status === 'pending').length;
      }, 0);
      const prevPendingCount = pendingReviewCount;
      setPendingReviewCount(pendingCount);

      // Also update check-in count
      const checkinCount = res.data.reduce((total: number, event: any) => {
        return total + event.participants.filter((p: any) => 
          p.status === 'approved' && hasEventStarted(event.startTime)
        ).length;
      }, 0);
      const prevCheckinCount = pendingCheckinCount;
      setPendingCheckinCount(checkinCount);
      
      // If counts changed, trigger refresh event to sync all components
      if (prevPendingCount !== pendingCount || prevCheckinCount !== checkinCount) {
        window.dispatchEvent(new Event('pending-counts-updated'));
      }
    } catch (err) {
      console.error('Failed to fetch pending reviews:', err);
    }
  }, [userInfo?.id, pendingReviewCount, pendingCheckinCount]);

  // Initial fetch
  useEffect(() => {
    if (authUser) {
      setUserInfo(authUser as UserInfo);
    }
    fetchUserData();
  }, [fetchUserData, authUser]);

  // Poll for pending review updates
  useEffect(() => {
    if (!userInfo?.id) return;

    // Check every 30 seconds
    const interval = setInterval(checkPendingReviews, 30000);

    return () => clearInterval(interval);
  }, [checkPendingReviews, userInfo?.id]);

  // Refresh joined events only
  const refreshJoinedEvents = useCallback(async () => {
    if (!userInfo?.id) return;
    
    try {
      const joinedRes = await api.events.getJoined();
      setJoinedEvents(joinedRes.data);
    } catch (err) {
      console.error('Failed to refresh joined events:', err);
    }
  }, [userInfo?.id]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    router.push('/login');
  }, [router]);

  return {
    userInfo,
    createdEvents,
    joinedEvents,
    pendingReviewCount,
    pendingCheckinCount,
    loading,
    error,
    fetchUserData,
    checkPendingReviews,
    refreshJoinedEvents,
    logout,
  };
}