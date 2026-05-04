import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) return alert("Enter all fields");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5001/auth/login",
        { email, password }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        window.location.replace("/dashboard");
      } else {
        alert(res.data);
      }
    } catch (err) {
      console.log(err);
      alert("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 overflow-hidden">

      {/* Glow */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl w-96 hover:scale-105 transition"
      >
        <h2 className="text-3xl text-white text-center mb-6 font-semibold">
          Welcome Back 🚀
        </h2>

        <input
          className="w-full p-3 mb-4 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-6 rounded-xl bg-white/10 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={login}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <p
          className="text-center mt-4 text-gray-300 cursor-pointer hover:text-white"
          onClick={() => (window.location.href = "/signup")}
        >
          Don’t have an account? Signup
        </p>
      </motion.div>
    </div>
  );
}