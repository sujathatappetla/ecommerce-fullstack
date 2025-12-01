import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-backend-2-zzbm.onrender.com",
  withCredentials: true, 
});

export default api;
