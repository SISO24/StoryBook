import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginService,
  signupService,
  logoutService,
} from "../service/AuthService";
import useAuthStore from "../store/AuthStore";
import toast from "react-hot-toast";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const login = async (email, password) => {
    setLoading(true);
    try {
      await loginService(email, password);
      toast.success("Welcome back");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      await signupService(email, password);
      toast.success("Account Created");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  };

  return { login, logout, signup, loading, user, isAuthenticated };
};
