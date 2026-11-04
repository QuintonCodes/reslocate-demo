"use client";

import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import { useState } from "react";

import { User } from "@/lib/types";

type LoginModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: User) => void;
  defaultTab?: "learner" | "staff";
  closable?: boolean;
};

type LoginModalContentProps = {
  onClose?: () => void;
  onSuccess: (user: User) => void;
  defaultTab: "learner" | "staff";
  closable?: boolean;
};

function LoginModalContent({
  onClose,
  onSuccess,
  defaultTab,
  closable = true,
}: LoginModalContentProps) {
  const [activeTab, setActiveTab] = useState<"learner" | "staff">(defaultTab);
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: activeTab, email, secret }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onSuccess(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Sign in to Reslocate
          </h2>
          {closable && onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X />
            </button>
          )}
        </div>

        <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("learner")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
              activeTab === "learner"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <UserIcon /> Learner
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("staff")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
              activeTab === "staff"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <ShieldCheck /> Staff
          </button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 text-gray-800 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {activeTab === "learner" ? "Phone Number" : "Password"}
            </label>
            <div className="relative">
              <input
                type={
                  activeTab === "learner"
                    ? "tel"
                    : showPassword
                      ? "text"
                      : "password"
                }
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full rounded-xl border border-slate-200 text-gray-800 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                placeholder={
                  activeTab === "learner" ? "+27 70 000 0000" : "••••••••"
                }
                required
              />
              {activeTab === "staff" && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              )}
            </div>
            {activeTab === "learner" && (
              <p className="mt-1.5 text-xs text-slate-500">
                Used to securely verify your identity.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-slate-800 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = "learner",
  closable = true,
}: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <LoginModalContent
      key={defaultTab}
      onClose={onClose}
      onSuccess={onSuccess}
      defaultTab={defaultTab}
      closable={closable}
    />
  );
}
