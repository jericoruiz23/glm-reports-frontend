// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/me`,
          { method: "GET", credentials: "include" }
        );

        if (!res.ok) {
          setUser(null);
          setMustChangePassword(false);
        } else {
          const data = await res.json();
          setUser(data.user);
          setMustChangePassword(data.user?.passwordMustChange || false);
        }
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
    setUser(null);              // limpia sesión frontend
    setMustChangePassword(false); // elimina el bloqueo
  };


  const login = async (email, password) => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Error al iniciar sesión");
    }

    const data = await res.json();

    setUser({
      ...data.user,
      passwordMustChange: data.passwordMustChange ?? false,
    });

    setMustChangePassword(data.passwordMustChange ?? false);
    return data;
  };

  // AuthContext.jsx
  const logout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
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
