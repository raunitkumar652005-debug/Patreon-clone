"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Signup - Patreon Clone";
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(session.user?.isCreator ? "/dashboard" : "/");
    }
  }, [router, session, status]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Unable to create your account.");
      setIsLoading(false);
      return;
    }

    setSuccess("Account created. Signing you in...");

    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setIsLoading(false);

    if (result?.error) {
      router.push("/login");
      return;
    }

    const updatedSession = await update();
    router.push(updatedSession?.user?.isCreator ? "/dashboard" : "/");
  };

  return (
    <div className="container mx-auto px-6 py-14 text-white">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-3xl font-bold">Create your account</h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          {error && (
            <p className="rounded-lg border border-red-400 bg-red-950/60 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg border border-green-400 bg-green-950/60 px-3 py-2 text-sm text-green-100">
              {success}
            </p>
          )}

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-200">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-300 hover:text-blue-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
