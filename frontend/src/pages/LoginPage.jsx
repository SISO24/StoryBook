import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <>
      <div className=" w-full flex flex-col  md:flex-row">
        <div className=" md:flex bg-[#111111]  md:flex bg-[#191919] md:w-2/5 lg:w-1/2  flex-col ">
          {" "}
          {/* starting div of left side */}
          <div className="mt-4 ml-4 flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-base">S</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight ml-2 mt-2">
              StoryBook
            </span>
          </div>
          <div className="space-y-4 mt-16 lg:mt-24 px-6 lg:px-10">
            <p className="text-[#e8e8e8] text-3xl lg:text-5xl font-light leading-relaxed tracking-tight">
              Where every story
            </p>
            <p className="text-white text-3xl lg:text-5xl font-bold leading-relaxed tracking-tight">
              finds its
            </p>
            <p className="text-white text-5xl font-bold leading-relaxed tracking-tight">
              voice.
            </p>

            <p className="text-[#a8a8a8] text-base lg:text-lg leading-relaxed max-w-md lg:max-w-xl font-light mt-8">
              Write, organize, and share your stories with the world. A
              workspace built for writers who think in chapters.
            </p>
          </div>
        </div>{" "}
        {/* ending div of left side */}
        {/* form section*/}
        <div className="bg-[#191919] w-full md:w-3/5 lg:w-1/2 min-h-screen flex flex-col justify-start md:justify-center items-center px-6 sm:px-8 pt-20 pb-12">
          <div className="w-full max-w-md space-y-10">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-[#8e8e8e] text-lg font-light">
                Sign in to continue your story
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[#8a8a8a] text-xs font-semibold uppercase tracking-wider block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-[#1c1c1c] border border-[#2d2d2d] rounded-2xl px-5 py-4 text-[#e8e8e8] text-base placeholder-[#4a4a4a] focus:outline-none focus:border-[#444] transition-all duration-200"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[#8a8a8a] text-xs font-semibold uppercase tracking-wider block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#1c1c1c] border border-[#2d2d2d] rounded-2xl px-5 py-4 text-[#e8e8e8] text-base placeholder-[#4a4a4a] focus:outline-none focus:border-[#444] transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-[#f0f0f0] text-black font-semibold py-4 rounded-2xl text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-md"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1 h-px bg-[#222222]" />
              <span className="text-[#555] text-xs font-light">or</span>
              <div className="flex-1 h-px bg-[#222222]" />
            </div>

            {/* Signup link */}
            <p className="text-center text-[#a8a8a8] text-base font-light">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-white hover:text-[#e8e8e8] font-semibold underline underline-offset-4 transition-colors duration-200"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
