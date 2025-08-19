import axios from "axios";

const API_BASE = "http://localhost:3000/auth";

export async function loginUser(credentials) {
  const res = await axios.post(`${API_BASE}/login`, credentials);
  return res.data;
}

export async function registerUser(data) {
  const res = await axios.post(`${API_BASE}/register`, data);
  return res.data;
}

export async function getProfile(token) {
  const res = await axios.get(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
