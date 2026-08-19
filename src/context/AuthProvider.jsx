import { useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { user: userData, tokens } = response.data;
    const accessToken = tokens.access.token;

    setToken(accessToken);
    setUser(userData);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  };

  const register = async (payload) => {
    const response = await api.post("/auth/register", payload);
    const { user: userData, tokens } = response.data;
    const accessToken = tokens.access.token;

    setToken(accessToken);
    setUser(userData);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const authValue = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isVendor: user?.role === "VENDOR",
    isCustomer: user?.role === "CUSTOMER",
    isAdmin: user?.role === "ADMIN",
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
