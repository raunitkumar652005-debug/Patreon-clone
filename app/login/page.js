"use client";

import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const errorMessages = {
  CredentialsSignin: "Invalid email or password.",
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
};

const LoginForm = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const authError = searchParams.get("error");
  const visibleError =
    error || (authError ? errorMessages[authError] || "Unable to sign in. Please try again." : "");

  useEffect(() => {
    document.title = "Login - Patreon Clone";
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
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(errorMessages[result.error] || result.error);
      return;
    }

    const updatedSession = await update();
    router.push(updatedSession?.user?.isCreator ? "/dashboard" : "/");
  };

  return (
    <div className="container mx-auto px-6 py-14 text-white">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <h1 className="text-center text-3xl font-bold">
          Login/signup to get your fans support you
        </h1>

        <div className="mt-10 flex w-full flex-col items-center gap-3">
          <button
            onClick={() => signIn("google")}
            className="flex w-full max-w-xs items-center justify-center gap-3 rounded-lg border border-gray-300 bg-slate-50 px-6 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600">
              G
            </span>
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => signIn("github")}
            className="flex w-full max-w-xs items-center justify-center gap-3 rounded-lg border border-gray-300 bg-slate-50 px-6 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              GH
            </span>
            <span>Continue with Github</span>
          </button>
        </div>

        <div className="my-8 flex w-full max-w-xs items-center gap-3 text-sm text-gray-300">
          <div className="h-px flex-1 bg-gray-600" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-600" />
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
          {visibleError && (
            <p className="rounded-lg border border-red-400 bg-red-950/60 px-3 py-2 text-sm text-red-100">
              {visibleError}
            </p>
          )}

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
              required
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign in with email"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-200">
          New here?{" "}
          <Link href="/signup" className="font-medium text-blue-300 hover:text-blue-200">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-14 text-white" />}>
      <LoginForm />
    </Suspense>
  );
};

export default Login;
