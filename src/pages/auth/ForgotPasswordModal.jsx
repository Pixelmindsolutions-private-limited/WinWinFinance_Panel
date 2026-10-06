import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TriangleAlert,
  X
} from "lucide-react";
import {
  generateAdminOtp,
  resetAdminPassword,
  verifyAdminOtp
} from "../../services/auth";

const STEPS = ["email", "otp", "reset"];
const RESEND_SECONDS = 30;

const TITLES = {
  email: ["Forgot password?", "Enter your admin email and we'll send you a verification code."],
  otp: ["Enter the code", "Type the 6-digit code we sent to your email."],
  reset: ["Set a new password", "Choose a password you haven't used before."],
  done: ["Password updated", "You can now sign in with your new password."]
};

const inputClass =
  "block w-full rounded-xl border border-slate-200 bg-white py-3 text-sm text-slate-900 " +
  "placeholder:text-slate-400 shadow-sm transition " +
  "focus:border-winwin-600 focus:outline-none focus:ring-4 focus:ring-winwin-600/15 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50";

const primaryBtn =
  "group flex w-full items-center justify-center gap-2 rounded-xl bg-winwin-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-winwin-600/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-winwin-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70";

export default function ForgotPasswordModal({ initialEmail = "", onClose, onDone }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(initialEmail);
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Close on Escape (unless a request is running)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, onClose]);

  // Stop the page behind the modal from scrolling
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const run = async (action) => {
    setError("");
    setLoading(true);
    try {
      await action();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = (e) => {
    e?.preventDefault();
    run(async () => {
      const result = await generateAdminOtp(email.trim());
      setUserId(result.userId);
      setInfo(result.message);
      setOtp("");
      setCooldown(RESEND_SECONDS);
      setStep("otp");
    });
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    run(async () => {
      await verifyAdminOtp(userId, otp);
      setStep("reset");
    });
  };

  const resetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    run(async () => {
      await resetAdminPassword(userId, newPassword, confirmPassword);
      setStep("done");
    });
  };

  const [title, subtitle] = TITLES[step];
  const stepIndex = STEPS.indexOf(step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-title"
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600 disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Step progress */}
        {step !== "done" && (
          <div className="mb-5 flex gap-1.5 pr-8" aria-hidden="true">
            {STEPS.map((name, index) => (
              <span
                key={name}
                className={[
                  "h-1.5 flex-1 rounded-full transition-colors",
                  index <= stepIndex ? "bg-winwin-600" : "bg-slate-200"
                ].join(" ")}
              />
            ))}
          </div>
        )}

        <div
          className={[
            "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl",
            step === "done"
              ? "bg-green-50 text-green-600"
              : "bg-winwin-50 text-winwin-600"
          ].join(" ")}
        >
          {step === "done" ? (
            <CheckCircle2 size={24} />
          ) : step === "otp" ? (
            <ShieldCheck size={24} />
          ) : step === "reset" ? (
            <LockKeyhole size={24} />
          ) : (
            <KeyRound size={24} />
          )}
        </div>

        <h3 id="forgot-title" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <TriangleAlert size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: email */}
        {step === "email" && (
          <form onSubmit={sendOtp} className="mt-6 space-y-5">
            <div>
              <label htmlFor="fp-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="fp-email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="username"
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClass} pl-11 pr-4`}
                  placeholder="you@winwinfinance.com"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  Send code
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <form onSubmit={verifyOtp} className="mt-6 space-y-5">
            {info && (
              <p className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">{info}</p>
            )}

            <div>
              <label htmlFor="fp-otp" className="mb-1.5 block text-sm font-medium text-slate-700">
                Verification code
              </label>
              <input
                id="fp-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                required
                maxLength={6}
                disabled={loading}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className={`${inputClass} px-4 text-center text-xl font-semibold tracking-[0.5em]`}
                placeholder="------"
              />
            </div>

            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify code
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
                disabled={loading}
                className="rounded text-slate-500 hover:text-slate-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading || cooldown > 0}
                className="rounded font-semibold text-winwin-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600 disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: new password */}
        {step === "reset" && (
          <form onSubmit={resetPassword} className="mt-6 space-y-5">
            <div>
              <label htmlFor="fp-new" className="mb-1.5 block text-sm font-medium text-slate-700">
                New password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="fp-new"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  autoComplete="new-password"
                  disabled={loading}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${inputClass} pl-11 pr-12`}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="fp-confirm" className="mb-1.5 block text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="fp-confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${inputClass} pl-11 pr-4`}
                  placeholder="Re-enter the password"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        )}

        {/* Step 4: success */}
        {step === "done" && (
          <div className="mt-6">
            <button type="button" onClick={() => onDone(email.trim())} className={primaryBtn}>
              Back to login
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}