import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircleDollarSign,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TriangleAlert,
  UserRound
} from "lucide-react";
import { loginAdmin, loginStaff } from "../../services/auth";
import ForgotPasswordModal from "./ForgotPasswordModal";

// Staff uses a dummy account until its API is ready.
const STAFF_DEMO = { email: "staff@winwinfinance.com", password: "staff123" };

export default function Login({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = role === "admin";

  // Admin starts empty (real API). Staff is prefilled with the dummy account.
  const [email, setEmail] = useState(isAdmin ? "" : STAFF_DEMO.email);
  const [password, setPassword] = useState(isAdmin ? "" : STAFF_DEMO.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const title = isAdmin ? "Admin Login" : "Staff Login";
  const RoleIcon = isAdmin ? ShieldCheck : UserRound;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isAdmin) {
        await loginAdmin(email.trim(), password);
      } else {
        loginStaff(email.trim(), password);
      }

      const fallback = `/${role}/dashboard`;
      const from = location.state?.from?.pathname;

      navigate(from?.startsWith(`/${role}`) ? from : fallback, {
        replace: true
      });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(STAFF_DEMO.email);
    setPassword(STAFF_DEMO.password);
    setError("");
  };

  const inputClass =
    "block w-full rounded-xl border border-slate-200 bg-white py-3 text-sm text-slate-900 " +
    "placeholder:text-slate-400 shadow-sm transition " +
    "focus:border-winwin-600 focus:outline-none focus:ring-4 focus:ring-winwin-600/15 " +
    "disabled:cursor-not-allowed disabled:bg-slate-50";

  return (
    <div className="relative w-full max-w-md px-4 py-8 sm:px-0 sm:py-0">
      {/* Soft background glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-winwin-600/15 blur-3xl sm:h-72 sm:w-72"
      />

      {/* Brand — shown on small screens where the side panel is hidden */}
      <div className="relative mb-6 flex items-center gap-3 lg:hidden">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-winwin-600 text-white shadow-lg shadow-winwin-600/30">
          <CircleDollarSign size={24} />
        </div>
        <div>
          <p className="font-bold leading-tight text-slate-900">WinWin Finance</p>
          <p className="text-xs text-slate-500">Financial Management Platform</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8">
        {/* Accent strip */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-winwin-600 via-winwin-600/60 to-winwin-50" />

        <div className="mb-6 sm:mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-winwin-600 to-winwin-600/70 text-white shadow-lg shadow-winwin-600/30">
            <RoleIcon size={26} />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {isAdmin
              ? "Sign in to manage accounts, staff and reports."
              : "Sign in to handle your customers and daily collections."}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <TriangleAlert size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="username"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-11 pr-4`}
                placeholder="you@winwinfinance.com"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="rounded text-xs font-semibold text-winwin-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pl-11 pr-12`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-winwin-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-winwin-600/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-winwin-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in as {role}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials — staff only (dummy account) */}
        {!isAdmin && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700">Demo credentials</p>
              <button
                type="button"
                onClick={fillDemo}
                className="rounded-lg px-2 py-1 text-xs font-medium text-winwin-600 transition hover:bg-winwin-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600"
              >
                Fill in
              </button>
            </div>
            <dl className="mt-2 space-y-1 text-xs text-slate-500">
              <div className="flex flex-wrap gap-x-2">
                <dt className="w-16 shrink-0 text-slate-400">Email</dt>
                <dd className="break-all font-medium text-slate-600">{STAFF_DEMO.email}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="w-16 shrink-0 text-slate-400">Password</dt>
                <dd className="font-medium text-slate-600">{STAFF_DEMO.password}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Switch role */}
        <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          {isAdmin ? "Not an admin?" : "Are you an admin?"}{" "}
          <button
            type="button"
            onClick={() => navigate(isAdmin ? "/staff/login" : "/admin/login")}
            className="rounded font-semibold text-winwin-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600"
          >
            {isAdmin ? "Staff Login" : "Admin Login"}
          </button>
        </div>
      </div>

      {forgotOpen && (
        <ForgotPasswordModal
          initialEmail={email}
          onClose={() => setForgotOpen(false)}
          onDone={(resetEmail) => {
            setForgotOpen(false);
            setEmail(resetEmail);
            setPassword("");
            setError("");
          }}
        />
      )}
    </div>
  );
}