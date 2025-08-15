import axios, { AxiosInstance, AxiosError } from 'axios';

// Types
interface ApiError {
  message: string;
  errors?: string[];
}

// Token storage
let accessToken: string | null = null;

// Token management functions
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const setRefreshToken = (token: string | null) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('refreshToken', token);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }
};

export const clearTokens = () => {
  accessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refreshToken');
  }
};

// Create axios instance with defaults
const client: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
client.interceptors.request.use(
  (config) => {
    // Add access token to headers if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  
  failedQueue = [];
};

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as any;

    // Handle token expiration - try to refresh on ANY 401 error
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh for login/register endpoints
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                            originalRequest.url?.includes('/auth/register') ||
                            originalRequest.url?.includes('/auth/refresh');
      
      // Check if user is logged in (has refresh token)
      const refreshToken = getRefreshToken();
      
      if (!isAuthEndpoint && refreshToken) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return client(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call refresh endpoint with refresh token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
            { refreshToken }
          );
          
          const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
          
          // Update tokens
          setAccessToken(newAccessToken);
          setRefreshToken(newRefreshToken);
          
          // Update user data in localStorage for UI
          if (typeof window !== 'undefined') {
            localStorage.setItem('userData', JSON.stringify(user));
          }
          
          processQueue(null);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          clearTokens();
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userData');
            // Only redirect to login if we're not already on a public page
            const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
            if (!publicPaths.some(path => window.location.pathname.startsWith(path))) {
              window.location.href = '/login';
            }
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Only log actual errors, not 401s (which are normal for unauthenticated users)
    if (error.response?.status !== 401) {
      console.error('API Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }
    
    // For 401 errors when user is not logged in, silently reject
    if (error.response?.status === 401 && !getRefreshToken()) {
      return Promise.reject(error);
    }

    // Handle specific error cases
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const message = `请求过于频繁，请${retryAfter ? `${retryAfter}秒` : '稍'}后再试`;
      return Promise.reject(new Error(message));
    }

    if (error.response?.status === 403) {
      return Promise.reject(new Error('无权限访问'));
    }

    if (!navigator.onLine) {
      return Promise.reject(new Error('网络连接失败，请检查网络'));
    }
    
    const message = error.response?.data?.message || '请求失败，请稍后再试';
    
    return Promise.reject(new Error(message));
  }
);

// API namespace with all endpoints organized by domain
export const api = {
  auth: {
    register: (data: any) =>
      client.post('/api/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        mbti: data.mbti,
        interests: data.interests,
        whyJoin: data.whyJoin,
        idealBuddy: data.idealBuddy,
        expectEvent: data.expectEvent,
      }).then(res => {
        const { user, accessToken, refreshToken } = res.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        return res.data;
      }),
    login: (email: string, password: string) =>
      client.post('/api/auth/login', { email, password }).then(res => {
        const { user, accessToken, refreshToken } = res.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        return res.data;
      }),
    refresh: () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(new Error('No refresh token'));
      }
      return client.post('/api/auth/refresh', { refreshToken }).then(res => {
        const { user, accessToken, refreshToken: newRefreshToken } = res.data;
        setAccessToken(accessToken);
        setRefreshToken(newRefreshToken);
        return res.data;
      });
    },
    logout: () => {
      const refreshToken = getRefreshToken();
      return client.post('/api/auth/logout', { refreshToken }).then(res => {
        clearTokens();
        return res.data;
      });
    },
    requestPasswordReset: (email: string) =>
      client.post('/api/auth/request-reset', { email }).then(res => res.data),
    resetPassword: (token: string, newPassword: string) =>
      client.post('/api/auth/reset-password', { token, newPassword }).then(res => res.data),
  },
  
  user: {
    getProfile: () => client.get('/api/users/me').then(res => res.data),
    getById: (userId: string) => client.get(`/api/users/${userId}`).then(res => res.data),
    update: (userId: string, data: any) => client.patch(`/api/users/${userId}`, data).then(res => res.data),
    delete: (userId: string) => client.delete(`/api/users/${userId}`).then(res => res.data),
    checkEmailExists: (email: string) => 
      client.get('/api/users/check-email', { params: { email } }).then(res => res.data),
    checkUsernameExists: (username: string) =>
      client.get('/api/users/check-username', { params: { username } }).then(res => res.data),
    getCount: () => client.get('/api/users/count').then(res => res.data),
    getTopInterests: () => client.get('/api/users/top-interests').then(res => res.data),
    getStats: (userId: string) => client.get(`/api/stats/user/${userId}`).then(res => res.data),
  },
  
  events: {
    list: (category?: string) => 
      client.get('/api/events', category ? { params: { category } } : undefined).then(res => res.data),
    getById: (id: string) => client.get(`/api/events/${id}`).then(res => res.data),
    create: (data: any) => client.post('/api/events', data).then(res => res.data),
    update: (id: string, data: any) => client.patch(`/api/events/${id}`, data).then(res => res.data),
    delete: (id: string) => client.delete(`/api/events/${id}`).then(res => res.data),
    
    // Participant actions
    join: (id: string) => client.post(`/api/events/${id}/join`).then(res => res.data),
    leave: (id: string) => client.post(`/api/events/${id}/leave`).then(res => res.data),
    requestCancel: (id: string) => client.post(`/api/events/${id}/request-cancel`).then(res => res.data),
    
    // Organizer actions
    getManageable: () => client.get('/api/events/manage').then(res => res.data),
    getCreated: () => client.get('/api/events/my-created').then(res => res.data),
    getJoined: () => client.get('/api/events/my-participated').then(res => res.data),
    reviewParticipant: (eventId: string, userId: string, approve: boolean) =>
      client.post(`/api/events/${eventId}/review`, { userId, approve }).then(res => res.data),
    markAttendance: (eventId: string, userId: string, attended: boolean) =>
      client.post(`/api/events/${eventId}/attendance`, { userId, attended }).then(res => res.data),
    reviewCancellation: (eventId: string, userId: string, approve: boolean) =>
      client.post(`/api/events/${eventId}/review-cancel`, { userId, approve }).then(res => res.data),
  },
  
  notifications: {
    list: (params?: { limit?: number; skip?: number; unreadOnly?: boolean }) =>
      client.get('/api/notifications', { params }).then(res => res.data),
    getUnreadCount: () => 
      client.get('/api/notifications/unread-count').then(res => res.data),
    markAsRead: (notificationIds: string[]) =>
      client.post('/api/notifications/mark-read', { notificationIds }).then(res => res.data),
    markAllAsRead: () => 
      client.post('/api/notifications/mark-all-read').then(res => res.data),
    delete: (id: string) => 
      client.delete(`/api/notifications/${id}`).then(res => res.data),
  },
  
  treeHole: {
    getPosts: () => 
      client.get('/api/tree-hole/posts').then(res => res.data),
    createPost: (data: { content: string }) => 
      client.post('/api/tree-hole/posts', data).then(res => res.data),
    toggleLike: (postId: string) => 
      client.post(`/api/tree-hole/posts/${postId}/like`).then(res => res.data),
  },
};

// Legacy function wrappers for backward compatibility
export const getUser = () => api.user.getProfile();
export const getUserById = (userId: string) => api.user.getById(userId);
export const updateUser = (userId: string, data: any) => api.user.update(userId, data);
export const deleteUser = (userId: string) => api.user.delete(userId);

export const getEvents = () => api.events.list();
export const createEvent = (eventData: any) => api.events.create(eventData);
export const getCreatedEvents = () => api.events.getCreated();
export const getJoinedEvents = () => api.events.getJoined();
export const getManageEvents = () => api.events.getManageable();
export const joinEvent = (eventId: string) => api.events.join(eventId);
export const cancelEvent = (eventId: string) => api.events.leave(eventId);
export const reviewParticipant = (eventId: string, userId: string, approve: boolean) => 
  api.events.reviewParticipant(eventId, userId, approve);
export const markAttendance = (eventId: string, userId: string, attended: boolean) =>
  api.events.markAttendance(eventId, userId, attended);

export const login = (email: string, password: string) => api.auth.login(email, password);
export const registerUser = (formData: any) => api.auth.register(formData);

export const checkEmailExists = (email: string) => api.user.checkEmailExists(email);
export const checkUsernameExists = (username: string) => api.user.checkUsernameExists(username);
export const getUserCount = () => api.user.getCount();
export const getTopInterests = () => api.user.getTopInterests();

export const getNotifications = (params?: any) => api.notifications.list(params);
export const getUnreadCount = () => api.notifications.getUnreadCount();
export const markNotificationsAsRead = (notificationIds: string[]) => 
  api.notifications.markAsRead(notificationIds);
export const markAllNotificationsAsRead = () => api.notifications.markAllAsRead();
export const deleteNotification = (id: string) => api.notifications.delete(id);

// Re-export for backward compatibility
export { client as axiosInstance };
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;