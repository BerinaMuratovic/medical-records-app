import axios from "axios";

const api = axios.create({
  baseURL: "https://medical-records-app-8.onrender.com/api",
});

export default api;
