import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-backend-3-un5e.onrender.com",
  withCredentials: true, 
});

export default api;
