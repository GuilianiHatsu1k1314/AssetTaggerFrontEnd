import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
// import logo from "../assets/images/indu-logo-transparent.png";

export const Route = createFileRoute("/")({
  component: Login,
});

function Login() {
  // 1. Typed Refs
  const emailRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login";
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  // 2. Fixed Event Type
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const correctEmail = "induadvertisementsystem@gmail.com";
    const correctPassword = "induxptssd2025";

    if (email === correctEmail && password === correctPassword) {
      setEmail("");
      setPassword("");
      // navigate({ to: "/dashboard" }); // Uncomment when route exists
      alert("Login Successful");
    } else {
      setErrMsg("Invalid Email or Password");
      errRef.current?.focus();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* Main Card Container */}
      <div className="relative flex min-h-[350px] w-full max-w-6xl flex-col gap-10 overflow-hidden rounded-[2.5rem] border-2 border-blue-400/30 bg-[#123993] p-12 shadow-xl md:flex-row md:p-16">
        {/* Left Side: Logo & Title */}
        <div className="flex flex-col justify-start gap-6 md:w-1/3">
          {/* Logo Area */}
          <div className="flex items-center gap-2">
            {/* Placeholder for Logo if image fails */}
            <h1 className="text-5xl font-black tracking-tighter text-white"></h1>
            {/* Use your image here: <img src={logo} alt="JDN Logo" className="h-12 w-auto" /> */}
          </div>

          <h2 className="mt-2 text-5xl font-normal text-white md:text-5xl">
            Sign Up
          </h2>
        </div>

        {/* Right Section: Form Fields */}
        <form
          className="relative mt-8 flex flex-1 flex-col justify-center gap-6 md:mt-0"
          onSubmit={handleSubmit}
        >
          {/* Error Message - Positioned Absolutely */}
          {/* 'absolute' takes it out of flow. '-top-12' pushes it up above the first input. */}
          <div className="absolute -top-14 left-0 flex w-full justify-center">
            {errMsg && (
              <p
                className="animate-pulse rounded-md border border-red-500 bg-red-500/20 px-4 py-2 text-center text-sm font-bold text-white shadow-md"
                ref={errRef}
              >
                {errMsg}
              </p>
            )}
          </div>

          {/* Username Input */}
          <div className="w-full">
            <input
              // FIX: Added 'bg-gray-200' for visibility and 'text-gray-900' for readable text
              className="w-full rounded-md bg-gray-200 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Username"
              ref={emailRef}
              type="text"
              value={email}
            />
          </div>

          {/* Password Input */}
          <div className="w-full">
            <input
              // FIX: Added 'bg-gray-200' for visibility and 'text-gray-900' for readable text
              className="w-full rounded-md bg-gray-200 px-6 py-4 text-lg text-gray-900 placeholder-gray-500 transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              type="password"
              value={password}
            />
          </div>

          {/* Login Button Area */}
          <div className="mt-4 flex justify-end">
            <button
              className="rounded-full bg-[#567bfb] px-12 py-3 text-xl font-medium text-white shadow-lg transition-colors hover:bg-[#466bea]"
              // CHANGE 2: Add the navigation directly here
              onClick={() => navigate({ to: "/LandingPage" })}
              // CHANGE 1: Set type to "button" so it doesn't try to submit the form
              type="button"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
