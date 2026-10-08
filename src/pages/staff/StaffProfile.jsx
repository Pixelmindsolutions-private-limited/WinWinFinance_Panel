import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Building2,
  CalendarClock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StaffAPI from "../../services/StaffAPI";
import { getAuth, updateAuthProfile } from "../../services/auth";
import {
  StaffAvatar,
  StatusBadge,
  formatDate,
} from "../admin/Staff Management/Staff/SingleStaff";

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-winwin-50 text-winwin-600">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-slate-800">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default function StaffProfile() {
  // Start with what the session already has, then refresh from the API
  const [staff, setStaff] = useState(() => getAuth()?.user || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await StaffAPI.getProfile();
      if (!res.staff || !res.staff._id) {
        throw new Error("Profile not found");
      }
      setStaff(res.staff);

      // Keep header / sidebar in sync with the latest profile
      updateAuthProfile({
        name: res.staff.name,
        email: res.staff.email,
        image: res.staff.image,
      });
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="View your staff account details."
        action={
          <button
            onClick={fetchProfile}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      {/* First load with nothing cached */}
      {!staff && loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Loading profile...
        </div>
      ) : !staff ? (
        <div className="card flex max-w-2xl flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="text-red-500" size={28} />
          <p className="text-sm text-slate-600">
            {error || "Profile not available"}
          </p>
          <button className="btn-primary" onClick={fetchProfile}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="max-w-3xl space-y-5">
          {/* Refresh failed but cached data is still shown */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}. Showing your last saved details.</span>
            </div>
          )}

          {/* Identity card */}
          <div className="card overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-winwin-600 to-winwin-600/60 sm:h-24" />
            <div className="px-5 pb-6 sm:px-6">
              <div className="-mt-10 flex flex-col items-center gap-4 text-center sm:-mt-12 sm:flex-row sm:items-end sm:text-left">
                <div className="rounded-full border-4 border-white bg-white shadow-sm">
                  <StaffAvatar
                    name={staff.name}
                    image={staff.image}
                    size="h-20 w-20 sm:h-24 sm:w-24"
                    text="text-2xl"
                  />
                </div>
                <div className="min-w-0 flex-1 sm:pb-1">
                  <h2 className="truncate text-xl font-bold text-slate-900">
                    {staff.name}
                  </h2>
                  <p className="truncate text-sm text-slate-500">
                    {staff.roleName || "No role assigned"}
                    {staff.departmentName ? ` · ${staff.departmentName}` : ""}
                  </p>
                </div>
                <div className="sm:pb-2">
                  <StatusBadge status={staff.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & work details */}
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              Account Details
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem icon={Mail} label="Email" value={staff.email} />
              <InfoItem icon={Phone} label="Phone" value={staff.phone} />
              <InfoItem
                icon={Building2}
                label="Department"
                value={staff.departmentName}
              />
              <InfoItem
                icon={ShieldCheck}
                label="Role"
                value={staff.roleName}
              />
              <div className="sm:col-span-2">
                <InfoItem icon={MapPin} label="Address" value={staff.address} />
              </div>
            </div>
          </div>

          {/* Record info */}
          <div className="card p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              Account Activity
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem
                icon={CalendarClock}
                label="Account Created"
                value={formatDate(staff.createdAt)}
              />
              <InfoItem
                icon={CalendarClock}
                label="Last Updated"
                value={formatDate(staff.updatedAt)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}