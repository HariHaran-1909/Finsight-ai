import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const setupMonth = (data) => API.post("/expenses/setup", data);
export const addExpense = (data) => API.post("/expenses/add", data);
export const getDashboard = (month) => API.get(`/expenses/dashboard/${month}`);
export const getMonths = () => API.get("/expenses/months");