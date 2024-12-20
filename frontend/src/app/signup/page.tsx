"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      username
    )}`;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign_up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          avatar,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Signup successful!");
      } else {
        setMessage(data.detail?.message || "Signup failed.");
      }
      router.push("/");
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
          Register
        </h2>

        {/* Form */}
        <form className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="User Name"
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 text-white bg-background rounded-lg hover:bg-sidebar"
            onClick={handleRegister}
            disabled={loading}
          >
           {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        {message && <p>{message}</p>}
        {/* Footer Links */}
        <div className="mt-4 text-center text-white text-sm">
          <br />
          <a href="/login" className="hover:underline">
            Sign In →
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
