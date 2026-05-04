import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// 🔥 YOUR LIVE BACKEND URL
const BASE_URL = "https://url-shortener-h6v7.onrender.com";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [input, setInput] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Copy function (robust)
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied! ✅");
    } catch {
      const temp = document.createElement("textarea");
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      alert("Copied! ✅");
    }
  };

  // ✅ Fetch URLs
  const fetchUrls = async () => {
    if (!token) return alert("Login again");

    try {
      const res = await axios.get(
        `${BASE_URL}/myurls?token=${token}`
      );
      setUrls(res.data);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  // ✅ Create URL
  const createUrl = async () => {
    if (!input) return alert("Enter URL");

    try {
      const encodedUrl = encodeURIComponent(input);

      await axios.get(
        `${BASE_URL}/shorten?url=${encodedUrl}&token=${token}`
      );

      setInput("");
      fetchUrls();
    } catch (err) {
      console.log("Create Error:", err);
    }
  };

  // ✅ Delete
  const deleteUrl = async (id) => {
    try {
      await axios.get(
        `${BASE_URL}/delete?id=${id}&token=${token}`
      );
      fetchUrls();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // ✅ Favorite
  const toggleFav = async (id) => {
    try {
      await axios.get(
        `${BASE_URL}/favorite?id=${id}&token=${token}`
      );
      fetchUrls();
    } catch (err) {
      console.log("Fav Error:", err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white flex flex-col overflow-hidden">

      {/* 🌌 Glow Background */}
      <div className="absolute w-80 h-80 bg-purple-600 blur-3xl opacity-20 top-0 left-0 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-blue-600 blur-3xl opacity-20 bottom-0 right-0 animate-pulse"></div>

      {/* 🔥 HEADER */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
        <h1 className="text-3xl font-bold tracking-wide flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
            className="w-6"
          />
          URL Shortener
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* 🌌 MAIN */}
      <div className="flex-1 p-8">

        {/* Hero */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
            className="w-14 opacity-80"
          />
          <div>
            <h2 className="text-xl font-semibold">Shorten & Track Links</h2>
            <p className="text-gray-400 text-sm">
              Create smart links, track clicks, and manage favorites.
            </p>
          </div>
        </div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 mb-10"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-white/10 backdrop-blur-lg outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Paste your long URL..."
          />

          <button
            onClick={createUrl}
            className="px-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl hover:scale-105 transition"
          >
            Shorten
          </button>
        </motion.div>

        {/* Empty */}
        {urls.length === 0 && (
          <div className="text-center mt-20 opacity-80">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076506.png"
              className="w-32 mx-auto mb-5"
            />
            <p>No URLs yet. Create your first one 🚀</p>
          </div>
        )}

        {/* LIST */}
        <div className="grid gap-6">
          {urls.map((u) => {
            const shortUrl = `${BASE_URL}/${u.short_code}`;

            return (
              <motion.div
                key={u.id}
                whileHover={{ scale: 1.03 }}
                className="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl flex justify-between items-center shadow-lg"
              >
                {/* LEFT */}
                <div className="max-w-[70%] flex gap-4">

                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png"
                    className="w-8 h-8 opacity-80"
                  />

                  <div>
                    <p className="text-sm text-gray-300 break-all">
                      {u.long_url}
                    </p>

                    <div className="flex gap-3 items-center mt-2">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400 font-semibold"
                      >
                        {shortUrl}
                      </a>

                      <button
                        onClick={() => copyToClipboard(shortUrl)}
                        className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                      >
                        Copy
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      Clicks: {u.clicks}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex gap-4 text-lg">
                  <button onClick={() => toggleFav(u.id)}>
                    {u.is_favorite ? "⭐" : "☆"}
                  </button>

                  <button onClick={() => deleteUrl(u.id)}>
                    ❌
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 🔥 FOOTER */}
      <div className="p-4 text-center text-gray-400 border-t border-white/10 text-sm backdrop-blur-md">
        🚀 Built by Ujjawal | URL Shortener | React ⚛️ + Node 🟢 + MySQL 🐬
      </div>
    </div>
  );
}