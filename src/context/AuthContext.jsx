// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await api.get("/api/auth/me");
        setUser(data.user);
        setMustChangePassword(data.user?.passwordMustChange || false);
      } catch {
        setUser(null);
        setMustChangePassword(false);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();
  }, []);

  const passwordChanged = () => {
    setUser(null);
    setMustChangePassword(false);
  };

  const login = async (email, password) => {
    const data = await api.post("/api/auth/login", { email, password });

    setUser({
      ...data.user,
      passwordMustChange: data.passwordMustChange ?? false,
    });

    setMustChangePassword(data.passwordMustChange ?? false);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setMustChangePassword(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        mustChangePassword,
        initializing,
        login,
        logout,
        passwordChanged,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
