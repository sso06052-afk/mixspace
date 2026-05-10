"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">MixSpace</h1>
          <p className="text-text-secondary mt-2">Sign in to continue</p>
        </div>

        <div className="bg-bg-elevated border border-border rounded-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="text-text-primary font-semibold mb-2">Check your email</h2>
              <p className="text-text-secondary text-sm">
                We sent a magic link to <span className="text-text-primary">{email}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-text-secondary mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-purple transition-colors"
                />
              </div>

              {error && (
                <p className="text-accent-red text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent-purple hover:bg-purple-500 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          No password needed. We&apos;ll email you a sign-in link.
        </p>
      </div>
    </div>
  );
}
