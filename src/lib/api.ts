// ✅ src/lib/api.ts
import axios from "axios";
import router from "next/router"; // ✅ 注意这是 client-only 路由跳转

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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
      window.location.href = "/login"; // ✅ 替代 router.push
      return new Promise(() => {}); // 阻止后续 catch 报错
    }

    return Promise.reject(new Error(msg));
  }
);


export const getUser = () => axiosInstance.get("/api/auth/me");
export const getCreatedEvents = () => axiosInstance.get("/api/events/my-created");
export const getJoinedEvents = () => axiosInstance.get("/api/events/my-participated");
export const getEvents = () => axiosInstance.get("/api/events");
export const createEvent = (eventData: any) => axiosInstance.post("/api/events", eventData);
export const joinEvent = (eventId: string) => axiosInstance.post(`/api/events/${eventId}/join`).then(res => res.data);
export const cancelEvent = (eventId: string) => axiosInstance.post(`/api/events/${eventId}/leave`).then(res => res.data);
export const getUserById = (userId: string) => axiosInstance.get(`/api/auth/users/${userId}`);
export const getManageEvents = () => axiosInstance.get("/api/events/manage");
export const reviewParticipant = (eventId: string, userId: string, approve: boolean) => axiosInstance.post(`/api/events/${eventId}/review`, { userId, approve });
export const markAttendance = (eventId: string, userId: string, attended: boolean) => axiosInstance.post(`/api/events/${eventId}/attendance`, { userId, attended });

export const login = (email: string, password: string) => axiosInstance.post("/api/auth/login", { email, password });

export const checkEmailExists = (email: string) => axiosInstance.get(`/api/auth/check-email`, { params: { email } });
export const checkUsernameExists = (username: string) => axiosInstance.get(`/api/auth/check-username`, { params: { username } });
export const registerUser = (formData: any) => {
  return axiosInstance.post("/api/auth/register", {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    personality: formData.personality,
    interests: formData.interests,
    canJoinPaid: formData.paidEventFortnightly === "是",
    canJoinPaidMonthly: formData.paidEventMonthly === "是",
    canJoinFree: formData.freeEventFortnightly === "是",
    canJoinFreeMonthly: formData.freeEventMonthly === "是",
    expectPaid: formData.expectPaid,
    expectFree: formData.expectFree,
    whyJoin: formData.whyJoin,
    idealBuddy: formData.idealBuddy,
    willPromote: formData.willPromote === "是",
  });
};





