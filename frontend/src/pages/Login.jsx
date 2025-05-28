import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role); // Store role

      toast.success("Login successful!");

      // Role-based redirection
      if (role === "viewer") {
        navigate("/home");
      } else if (role === "user") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex justify-center items-center px-4 overflow-hidden">
      {/* Floating Blobs */}
      <div className="absolute w-72 h-72 bg-purple-600 opacity-20 rounded-full filter blur-3xl animate-blob top-10 left-10" />
      <div className="absolute w-72 h-72 bg-pink-500 opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-4000 bottom-10 right-10" />

      <motion.div
        className="relative z-10 w-full max-w-md p-8 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all font-semibold rounded-md shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
