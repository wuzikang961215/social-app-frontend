import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
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
  const { user: authUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [createdEvents, setCreatedEvents] = useState<any[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user data and related events
  const fetchUserData = useCallback(async () => {
    if (!authUser) {
      // Don't redirect here - let AuthGuard handle it
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all user-related data in parallel
      const [userRes, createdRes, joinedRes] = await Promise.all([
        api.user.getProfile(),
        api.events.getCreated(),
        api.events.getJoined()
      ]);

      setUserInfo(userRes);  // userRes is already the user object, not wrapped
      setCreatedEvents(createdRes);
      setJoinedEvents(joinedRes);

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
  }, [router, authUser]);


  // Initial fetch
  useEffect(() => {
    if (authUser) {
      setUserInfo(authUser as UserInfo);
    }
    fetchUserData();
  }, [fetchUserData, authUser]);

  // Refresh joined events only
  const refreshJoinedEvents = useCallback(async () => {
    if (!userInfo?.id) return;
    
    try {
      const joinedRes = await api.events.getJoined();
      setJoinedEvents(joinedRes);
    } catch (err) {
      console.error('Failed to refresh joined events:', err);
    }
  }, [userInfo?.id]);

  // Logout function
  const logout = useCallback(() => {
    router.push('/login');
  }, [router]);

  return {
    userInfo,
    createdEvents,
    joinedEvents,
    loading,
    error,
    fetchUserData,
    refreshJoinedEvents,
    logout,
  };
}