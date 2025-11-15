"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters required"),
});

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithGithub } = useAuth();

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
      await signUp(values.name, values.email, values.password);
      router.push("/dashboard");
    } catch (error) {
      setFormError("Email already exists.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/60">
      <div className="w-[400px] bg-white text-black rounded-2xl shadow-xl p-6">

        <h2 className="text-xl font-semibold text-center">Create your account</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Fill details to get started
        </p>

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
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            {...register("name")}
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-md py-2 px-3"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}

          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className="w-full border rounded-md py-2 px-3"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full border rounded-md py-2 px-3"
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6366f1] text-white py-2 rounded-md"
          >
            {loading ? "Creating…" : "Continue"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}