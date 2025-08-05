import axios, { AxiosInstance, AxiosError } from 'axios';

// Types
interface ApiError {
  message: string;
  errors?: string[];
}

// Create axios instance with defaults
const client: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
client.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Log detailed error info for debugging
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });

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
    
    if (typeof window !== 'undefined' && message.includes('Token')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return new Promise(() => {}); // Prevent further execution
    }
    
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
        tags: data.tags,
        whyJoin: data.whyJoin,
        idealBuddy: data.idealBuddy,
      }),
    login: (email: string, password: string) =>
      client.post('/api/auth/login', { email, password }),
    requestPasswordReset: (email: string) =>
      client.post('/api/auth/request-reset', { email }),
    resetPassword: (token: string, newPassword: string) =>
      client.post('/api/auth/reset-password', { token, newPassword }),
  },
  
  user: {
    getProfile: () => client.get('/api/users/me'),
    getById: (userId: string) => client.get(`/api/users/${userId}`),
    update: (userId: string, data: any) => client.patch(`/api/users/${userId}`, data),
    delete: (userId: string) => client.delete(`/api/users/${userId}`),
    checkEmailExists: (email: string) => 
      client.get('/api/users/check-email', { params: { email } }),
    checkUsernameExists: (username: string) =>
      client.get('/api/users/check-username', { params: { username } }),
    getCount: () => client.get('/api/users/count').then(res => res.data),
    getTopInterests: () => client.get('/api/users/top-interests').then(res => res.data),
    getStats: (userId: string) => client.get(`/api/stats/user/${userId}`).then(res => res.data),
  },
  
  events: {
    list: (category?: string) => 
      client.get('/api/events', category ? { params: { category } } : undefined),
    getById: (id: string) => client.get(`/api/events/${id}`),
    create: (data: any) => client.post('/api/events', data),
    update: (id: string, data: any) => client.patch(`/api/events/${id}`, data),
    delete: (id: string) => client.delete(`/api/events/${id}`),
    
    // Participant actions
    join: (id: string) => client.post(`/api/events/${id}/join`).then(res => res.data),
    leave: (id: string) => client.post(`/api/events/${id}/leave`).then(res => res.data),
    requestCancel: (id: string) => client.post(`/api/events/${id}/request-cancel`),
    
    // Organizer actions
    getManageable: () => client.get('/api/events/manage'),
    getCreated: () => client.get('/api/events/my-created'),
    getJoined: () => client.get('/api/events/my-participated'),
    reviewParticipant: (eventId: string, userId: string, approve: boolean) =>
      client.post(`/api/events/${eventId}/review`, { userId, approve }),
    markAttendance: (eventId: string, userId: string, attended: boolean) =>
      client.post(`/api/events/${eventId}/attendance`, { userId, attended }),
    reviewCancellation: (eventId: string, userId: string, approve: boolean) =>
      client.post(`/api/events/${eventId}/review-cancel`, { userId, approve }),
  },
  
  notifications: {
    list: (params?: { limit?: number; skip?: number; unreadOnly?: boolean }) =>
      client.get('/api/notifications', { params }),
    getUnreadCount: () => 
      client.get('/api/notifications/unread-count').then(res => res.data),
    markAsRead: (notificationIds: string[]) =>
      client.post('/api/notifications/mark-read', { notificationIds }),
    markAllAsRead: () => 
      client.post('/api/notifications/mark-all-read'),
    delete: (id: string) => 
      client.delete(`/api/notifications/${id}`),
  },
  
  treeHole: {
    getPosts: () => 
      client.get('/api/tree-hole/posts'),
    createPost: (data: { content: string }) => 
      client.post('/api/tree-hole/posts', data),
    toggleLike: (postId: string) => 
      client.post(`/api/tree-hole/posts/${postId}/like`),
  },
  
  externalEvents: {
    getEvents: () => 
      client.get('/api/external-events'),
    create: (data: any) => 
      client.post('/api/external-events', data),
    update: (id: string, data: any) => 
      client.put(`/api/external-events/${id}`, data),
    delete: (id: string) => 
      client.delete(`/api/external-events/${id}`),
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