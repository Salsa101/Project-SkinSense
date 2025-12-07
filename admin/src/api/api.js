import axios from "axios";

const api = axios.create({
  baseURL: "https://project-skinsense-production.up.railway.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
