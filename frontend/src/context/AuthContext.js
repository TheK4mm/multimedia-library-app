import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../services/authApi";
import { tokenStorage } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [bootError, setBootErr] = useState(null);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  // On mount, try to rehydrate from stored token.
  useEffect(() => {
    const init = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await authApi.me();
        setUser(user);
      } catch (err) {
        setBootErr(err);
        tokenStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // React to 401 from the axios interceptor.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("mml:unauthorized", handler);
    return () => window.removeEventListener("mml:unauthorized", handler);
  }, [logout]);

  const login = async (credentials) => {
    const { token, user } = await authApi.login(credentials);
    tokenStorage.set(token);
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const { token, user } = await authApi.register(payload);
    tokenStorage.set(token);
    setUser(user);
    return user;
  };

  const value = {
    user,
    loading,
    bootError,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
