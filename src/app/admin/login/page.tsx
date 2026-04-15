"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="card">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  setError(null);
  setLoading(true);

  const supabase = supabaseBrowser();
  if (!supabase) {
    setError("Supabase env vars are missing. Check .env.local.");
    setLoading(false);
    return;
  }

  const { data, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  if (signInError) {
    setError(signInError.message);
    setLoading(false);
    return;
  }

  // 🔒 ADMIN CHECK (THIS IS WHAT YOU WERE MISSING)
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (data.user?.email !== ADMIN_EMAIL) {
    await supabase.auth.signOut(); // kick them out
    setError("Not authorized");
    setLoading(false);
    return;
  }

  // ✅ success
  router.replace(redirectedFrom);
};

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="card">
        <h1 className="font-display text-2xl">Admin login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with your Supabase admin email and password.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
