import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || "请求失败，请稍后再试";

    if (typeof window !== "undefined" && msg.includes("Token")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return new Promise(() => {});
    }

    return Promise.reject(new Error(msg));
  }
);

// ✅ 用户模块（/api/users）
export const getUser = () => axiosInstance.get("/api/users/me");
export const getUserById = (userId: string) => axiosInstance.get(`/api/users/${userId}`);
export const updateUser = (userId: string, data: any) => axiosInstance.patch(`/api/users/${userId}`, data);
export const deleteUser = (userId: string) => axiosInstance.delete(`/api/users/${userId}`);

// ✅ 活动模块（/api/events）
export const getCreatedEvents = () => axiosInstance.get("/api/events/my-created");
export const getJoinedEvents = () => axiosInstance.get("/api/events/my-participated");
export const getEvents = () => axiosInstance.get("/api/events");
export const createEvent = (eventData: any) => axiosInstance.post("/api/events", eventData);
export const joinEvent = (eventId: string) => axiosInstance.post(`/api/events/${eventId}/join`).then(res => res.data);
export const cancelEvent = (eventId: string) => axiosInstance.post(`/api/events/${eventId}/leave`).then(res => res.data);
export const getManageEvents = () => axiosInstance.get("/api/events/manage");
export const reviewParticipant = (eventId: string, userId: string, approve: boolean) =>
  axiosInstance.post(`/api/events/${eventId}/review`, { userId, approve });
export const markAttendance = (eventId: string, userId: string, attended: boolean) =>
  axiosInstance.post(`/api/events/${eventId}/attendance`, { userId, attended });

// ✅ Auth模块（/api/auth）
export const login = (email: string, password: string) =>
  axiosInstance.post("/api/auth/login", { email, password });

export const registerUser = (formData: any) =>
  axiosInstance.post("/api/auth/register", {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    personality: formData.personality,
    interests: formData.interests,
    tags: formData.tags,
    whyJoin: formData.whyJoin,
    idealBuddy: formData.idealBuddy,
  });

// ✅ 公共信息查询模块（/api/users）
export const checkEmailExists = (email: string) =>
  axiosInstance.get("/api/users/check-email", { params: { email } });

export const checkUsernameExists = (username: string) =>
  axiosInstance.get("/api/users/check-username", { params: { username } });

export const getUserCount = () =>
  axiosInstance.get("/api/users/count").then((res) => res.data);

export const getTopInterests = () =>
  axiosInstance.get("/api/users/top-interests").then((res) => res.data);
