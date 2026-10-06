import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
  User
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import {
  changeAdminPassword,
  getAdminProfile,
  profileImageUrl,
  updateAdminProfile,
  updateAdminProfileImage
} from "./adminProfileApi";
import { updateAuthProfile } from "../../../services/auth";

const MAX_IMAGE_MB = 5;

const inputClass =
  "block w-full rounded-xl border border-slate-200 bg-white py-3 text-sm text-slate-900 " +
  "placeholder:text-slate-400 shadow-sm transition " +
  "focus:border-winwin-600 focus:outline-none focus:ring-4 focus:ring-winwin-600/15 " +
  "disabled:cursor-not-allowed disabled:bg-slate-50";

const primaryBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-winwin-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-winwin-600/30 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-winwin-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none sm:w-auto";

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

/* ---------------- Small building blocks ---------------- */

function Notice({ notice }) {
  if (!notice) return null;
  const isError = notice.type === "error";
  const Icon = isError ? TriangleAlert : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={[
        "mb-5 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm",
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-700"
      ].join(" ")}
    >
      <Icon size={17} className="mt-0.5 shrink-0" />
      <span>{notice.text}</span>
    </div>
  );
}

function Field({ id, label, icon: Icon, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input id={id} className={`${inputClass} pl-11 pr-4`} {...props} />
      </div>
    </div>
  );
}

function PasswordField({ id, label, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <LockKeyhole
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`${inputClass} pl-11 pr-12`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((value) => !value)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mb-5 mt-0.5 text-sm text-slate-500">{description}</p>
      {children}
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-3">
      <div className="card h-72 bg-slate-100 lg:col-span-1" />
      <div className="space-y-6 lg:col-span-2">
        <div className="card h-72 bg-slate-100" />
        <div className="card h-80 bg-slate-100" />
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function AdminProfile() {
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [imageNotice, setImageNotice] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);

  const [pwd, setPwd] = useState({ password: "", newPassword: "", confirmPassword: "" });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdNotice, setPwdNotice] = useState(null);

  const loadProfile = useCallback(async () => {
    setLoadError("");
    try {
      const data = await getAdminProfile();
      setProfile(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || ""
      });
      setImageFailed(false);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const dirty =
    profile &&
    (form.name.trim() !== (profile.name || "") ||
      form.email.trim() !== (profile.email || "") ||
      form.phone.trim() !== (profile.phone || ""));

  /* ----- Save personal info ----- */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileNotice(null);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim()
    };

    if (!payload.name) {
      setProfileNotice({ type: "error", text: "Name is required." });
      return;
    }
    if (!/^\d{7,15}$/.test(payload.phone)) {
      setProfileNotice({ type: "error", text: "Enter a valid phone number (digits only)." });
      return;
    }

    setSaving(true);
    try {
      const result = await updateAdminProfile(payload);
      updateAuthProfile({ name: payload.name, email: payload.email });
      await loadProfile();
      setProfileNotice({ type: "success", text: result.message || "Profile updated successfully." });
    } catch (err) {
      setProfileNotice({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  /* ----- Upload photo ----- */
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;

    setImageNotice(null);

    if (!file.type.startsWith("image/")) {
      setImageNotice({ type: "error", text: "Please choose an image file." });
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageNotice({ type: "error", text: `Image must be smaller than ${MAX_IMAGE_MB} MB.` });
      return;
    }

    setUploading(true);
    try {
      const result = await updateAdminProfileImage(file);
      await loadProfile();
      setImageNotice({ type: "success", text: result.message || "Photo updated." });
    } catch (err) {
      setImageNotice({ type: "error", text: err.message });
    } finally {
      setUploading(false);
    }
  };

  /* ----- Change password ----- */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdNotice(null);

    if (pwd.newPassword.length < 6) {
      setPwdNotice({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (pwd.newPassword !== pwd.confirmPassword) {
      setPwdNotice({ type: "error", text: "New password and confirmation do not match." });
      return;
    }
    if (pwd.newPassword === pwd.password) {
      setPwdNotice({ type: "error", text: "New password must be different from the current one." });
      return;
    }

    setPwdSaving(true);
    try {
      const result = await changeAdminPassword(pwd);
      setPwd({ password: "", newPassword: "", confirmPassword: "" });
      setPwdNotice({ type: "success", text: result.message || "Password changed successfully." });
    } catch (err) {
      setPwdNotice({ type: "error", text: err.message });
    } finally {
      setPwdSaving(false);
    }
  };

  const imageSrc = profileImageUrl(profile?.image);
  const memberSince = profile?.logCreatedDate
    ? new Date(profile.logCreatedDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : null;

  return (
    <div>
      <PageHeader
        title="Admin Profile"
        description="Manage your administrator profile and preferences."
      />

      {loading ? (
        <ProfileSkeleton />
      ) : loadError && !profile ? (
        <div className="card flex max-w-xl flex-col items-start gap-4 p-6">
          <div className="flex items-start gap-2.5 text-sm text-red-700">
            <TriangleAlert size={18} className="mt-0.5 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadProfile();
            }}
            className={primaryBtn}
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ---------- Summary card ---------- */}
          <aside className="card h-fit overflow-hidden p-0 lg:col-span-1">
            <div className="h-20 bg-gradient-to-r from-winwin-600 via-winwin-600/70 to-winwin-50" />

            <div className="-mt-12 flex flex-col items-center px-5 pb-6 text-center sm:px-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-winwin-50 text-2xl font-bold text-winwin-600 shadow-lg">
                  {imageSrc && !imageFailed ? (
                    <img
                      src={imageSrc}
                      alt={`${profile?.name || "Admin"} profile`}
                      className="h-full w-full object-cover"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    initialsOf(profile?.name)
                  )}

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/50 text-white">
                      <Loader2 size={22} className="animate-spin" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-winwin-600 text-white shadow transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-winwin-600/30 disabled:opacity-60"
                >
                  <Camera size={16} />
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <h2 className="mt-4 break-words text-lg font-bold text-slate-900">
                {profile?.name || "Admin"}
              </h2>
              <p className="max-w-full break-all text-sm text-slate-500">{profile?.email}</p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-winwin-50 px-3 py-1 text-xs font-semibold capitalize text-winwin-600">
                  <ShieldCheck size={13} />
                  {profile?.role || "admin"}
                </span>
                {profile?.status && (
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                      profile.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    ].join(" ")}
                  >
                    {profile.status}
                  </span>
                )}
              </div>

              {memberSince && (
                <p className="mt-4 text-xs text-slate-400">Member since {memberSince}</p>
              )}

              <div className="mt-4 w-full text-left">
                <Notice notice={imageNotice} />
              </div>
            </div>
          </aside>

          {/* ---------- Forms ---------- */}
          <div className="space-y-6 lg:col-span-2">
            <SectionCard
              title="Personal information"
              description="Update your name, email address and phone number."
            >
              <Notice notice={profileNotice} />

              <form onSubmit={handleProfileSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Field
                      id="profile-name"
                      label="Full name"
                      icon={User}
                      type="text"
                      required
                      autoComplete="name"
                      disabled={saving}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <Field
                    id="profile-email"
                    label="Email address"
                    icon={Mail}
                    type="email"
                    required
                    autoComplete="email"
                    disabled={saving}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@winwinfinance.com"
                  />
                  <Field
                    id="profile-phone"
                    label="Phone number"
                    icon={Phone}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    disabled={saving}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 15) })
                    }
                    placeholder="9876543210"
                  />
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={!dirty || saving}
                    onClick={() => {
                      setForm({
                        name: profile.name || "",
                        email: profile.email || "",
                        phone: profile.phone || ""
                      });
                      setProfileNotice(null);
                    }}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-winwin-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    Reset
                  </button>
                  <button type="submit" disabled={!dirty || saving} className={primaryBtn}>
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </form>
            </SectionCard>

            <SectionCard
              title="Change password"
              description="Use at least 6 characters. You'll stay signed in on this device."
            >
              <Notice notice={pwdNotice} />

              <form onSubmit={handlePasswordSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <PasswordField
                      id="pwd-current"
                      label="Current password"
                      autoComplete="current-password"
                      disabled={pwdSaving}
                      value={pwd.password}
                      onChange={(e) => setPwd({ ...pwd, password: e.target.value })}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <PasswordField
                    id="pwd-new"
                    label="New password"
                    autoComplete="new-password"
                    disabled={pwdSaving}
                    value={pwd.newPassword}
                    onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                    placeholder="At least 6 characters"
                  />
                  <PasswordField
                    id="pwd-confirm"
                    label="Confirm new password"
                    autoComplete="new-password"
                    disabled={pwdSaving}
                    value={pwd.confirmPassword}
                    onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                    placeholder="Re-enter the new password"
                  />
                </div>

                <div className="mt-6 flex sm:justify-end">
                  <button
                    type="submit"
                    disabled={
                      pwdSaving || !pwd.password || !pwd.newPassword || !pwd.confirmPassword
                    }
                    className={primaryBtn}
                  >
                    {pwdSaving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update password"
                    )}
                  </button>
                </div>
              </form>
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
}