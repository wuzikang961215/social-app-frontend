import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { formatTimeRange } from '@/lib/format';
import type { Event } from '@/types/event';

interface UseEventsProps {
  userId?: string;
}

export function useEvents({ userId }: UseEventsProps = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Transform raw event data to Event type
  const transformEvent = useCallback((e: any, currentUserId?: string): Event => {
    const now = new Date();
    const date = new Date(e.startTime);
    const countdown = Math.floor((date.getTime() - now.getTime()) / 3600000);
    const approvedCount = e.participants.filter((p: any) => p.status === 'approved').length;
    const currentUser = currentUserId ? e.participants.find((p: any) => p.user.id === currentUserId) : null;

    return {
      id: e.id || e._id,
      title: e.title,
      time: formatTimeRange(e.startTime, e.durationMinutes),
      startTime: e.startTime,
      durationMinutes: e.durationMinutes,
      location: e.location,
      category: e.category,
      description: e.description,
      tags: e.tags,
      maxParticipants: e.maxParticipants,
      spotsLeft: e.maxParticipants - approvedCount,
      expired: e.expired,
      countdown,
      creator: e.creator,
      organizer: {
        name: e.creator?.username || '等待确认',
        avatar: '/avatar1.png',
        id: e.creator?.id || e.creator?._id || 'unknown',
      },
      participants: (e.participants || []).map((p: any) => ({
        user: {
          id: p.user.id,
          username: p.user.username,
        },
        status: p.status,
      })),
      userStatus: currentUser?.status ?? null,
      userCancelCount: currentUser?.cancelCount || 0,
      isOrganizer: currentUserId ? e.creator?.id === currentUserId : false,
    };
  }, []);

  // Get user priority for sorting
  const getUserPriority = useCallback((event: Event): number => {
    if (event.isOrganizer) return 3;
    const status = event.userStatus;
    if (!status || status === 'cancelled') return 0;
    if (status === 'pending') return 1;
    if (status === 'approved' || status === 'checkedIn') return 2;
    return 4;
  }, []);

  // Sort events by priority and other factors
  const sortEvents = useCallback((eventsToSort: Event[]) => {
    return [...eventsToSort].sort((a, b) => {
      // Priority comparison
      const priorityDiff = getUserPriority(a) - getUserPriority(b);
      if (priorityDiff !== 0) return priorityDiff;

      // Full status comparison
      if (a.spotsLeft <= 0 && b.spotsLeft > 0) return 1;
      if (a.spotsLeft > 0 && b.spotsLeft <= 0) return -1;

      // Sort by time first (earlier events first)
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      const timeDiff = timeA - timeB;
      
      // If events are on the same day (within 24 hours of each other), prioritize by time
      if (Math.abs(timeDiff) < 24 * 60 * 60 * 1000) {
        return timeDiff; // Earlier time comes first
      }
      
      // For events on different days, use the original scoring
      return (a.countdown + a.spotsLeft * 2) - (b.countdown + b.spotsLeft * 2);
    });
  }, [getUserPriority]);

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.events.list();
      const transformed = response.map((e: any) => transformEvent(e, userId));
      const sorted = sortEvents(transformed);
      setEvents(sorted);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId, transformEvent, sortEvents]);

  // Update single event in the list
  const updateEvent = useCallback((eventId: string, updates: Partial<Event>) => {
    setEvents(prev => {
      const updated = prev.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      );
      return sortEvents(updated);
    });
  }, [sortEvents]);

  // Join event
  const joinEvent = useCallback(async (eventId: string) => {
    try {
      const data = await api.events.join(eventId);
      updateEvent(eventId, { userStatus: 'pending' });
      return data;
    } catch (error) {
      console.error('Failed to join event:', error);
      throw error;
    }
  }, [updateEvent]);

  // Cancel event participation
  const cancelEvent = useCallback(async (eventId: string) => {
    try {
      const data = await api.events.leave(eventId);
      setEvents(prev => 
        prev.map(ev =>
          ev.id === eventId
            ? {
                ...ev,
                userStatus: 'cancelled',
                userCancelCount: (ev.userCancelCount || 0) + 1,
              }
            : ev
        )
      );
      return data;
    } catch (error) {
      console.error('Failed to cancel event:', error);
      throw error;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchEvents();
    }
  }, [userId, fetchEvents]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefreshEvents = () => {
      if (userId) {
        fetchEvents();
      }
    };

    window.addEventListener('refresh-events', handleRefreshEvents);
    return () => window.removeEventListener('refresh-events', handleRefreshEvents);
  }, [userId, fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    updateEvent,
    joinEvent,
    cancelEvent,
  };
}