"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password required"),
});

export default function SignInPage() {
  const { signIn, signInWithGoogle, signInWithGithub } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values) {
    setLoading(true);
    setFormError("");

    try {
      await signIn(values.email, values.password);
      router.push("/dashboard");
    } catch (err) {
      setFormError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/60">
      <div className="w-[400px] bg-white p-6 rounded-2xl shadow-xl">

        <h2 className="text-xl font-semibold text-center">Welcome!</h2>
        <p className="text-sm text-gray-600 text-center mb-4">Sign in to continue</p>

        <div className="flex gap-3 mb-4">

          <button
            disabled={githubLoading}
            onClick={async () => {
              setGithubLoading(true);
              try {
                await signInWithGithub();
              } finally {
                setGithubLoading(false);
              }
            }}
            className="flex-1 border rounded-md py-2"
          >
            {githubLoading ? "Loading..." : "GitHub"}
          </button>

          <button
            disabled={googleLoading}
            onClick={async () => {
              setGoogleLoading(true);
              try {
                await signInWithGoogle();
              } finally {
                setGoogleLoading(false);
              }
            }}
            className="flex-1 border rounded-md py-2"
          >
            {googleLoading ? "Loading..." : "Google"}
          </button>

        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}

          {formError && <p className="text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white py-2 rounded-md"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="text-blue-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
}