import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/register", formData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(
        "Error registering: " + err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] px-4">
      <motion.div
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl text-white"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-yellow-300">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20 transition"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20 transition"
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20 transition"
            whileFocus={{ scale: 1.02 }}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20 transition"
          >
            <option
              value="user"
              className="w-full px-4 py-3 rounded-md bg-white/20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20 transition"
            >
              User
            </option>
            <option
              value="viewer"
              className="w-full px-4 py-3 rounded-md bg-white/20 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-white/20 transition"
            >
              Viewer
            </option>
          </select>

          <motion.button
            type="submit"
            className="w-full py-3 rounded-md bg-gradient-to-r from-yellow-400 to-red-400 hover:from-yellow-500 hover:to-red-500 transition-all text-black font-semibold shadow-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
