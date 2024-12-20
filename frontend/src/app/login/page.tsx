"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GlassLogin: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hadleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign_in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token in local storage
        if (data.token) {
          
          setMessage("Login successful! Redirecting...");
          router.push("/"); 
        } else {
          setMessage("Login successful but token is missing.");
        }
      } else {
        setMessage(data.detail?.message.get("message") || "Login failed.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
    
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary via-secondary-100 to-secondary-300">
      <div className="relative bg-white/10 backdrop-blur-md shadow-lg rounded-lg p-8 w-[350px]">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <h5
            onClick={() => router.push("/aboutUs")}
            className="text-xl bg-gradient-to-r from-violet-500  to-pink-500 inline-block text-transparent bg-clip-text cursor-pointer"
          >
            FAITH
          </h5>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-white text-2xl font-bold mb-4">
          Login
        </h2>

        {/* Form */}
        <form className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white bg-background rounded-lg hover:bg-sidebar"
            onClick={hadleLogin}
            disabled={loading}
          >
             {loading ? "Logging in..." : "Login"}
          </button>
          {message && <p className="text-center">{message}</p>}
        </form>
       
        {/* Footer Links */}
        <div className="mt-4 text-center text-white text-sm">
      
          <br />
          <a href="/signup" className="hover:underline">
            Create your Account →
          </a>
        </div>
      </div>
    </div>
  );
};

export default GlassLogin;
