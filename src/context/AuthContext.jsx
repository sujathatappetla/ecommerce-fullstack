
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/api/auth/me"); // backend must return user if cookie valid even on refresh to stay as logged in
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login (cookie already set by backend)
   
  const login = (userData) => {
    setUser(userData);
  };

  // Logout (remove cookie from backend)
  
 const logout = async () => {
  try {
    await api.post("/api/auth/logout", {}, { withCredentials: true });
  } catch (err) {
    console.log("Logout error:", err);
  }

  setUser(null);
  localStorage.removeItem("guest_cart"); 
};
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
