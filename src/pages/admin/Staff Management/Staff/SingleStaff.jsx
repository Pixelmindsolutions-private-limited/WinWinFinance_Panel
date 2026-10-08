import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import Modal from "../../../../components/common/Modal";
import StaffAPI, { getImageUrl } from "../../../../services/StaffAPI";

export const STAFF_BASE_PATH = "/admin/staff";

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

export const StatusBadge = ({ status }) => {
  const active = status === "active";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        active ? "bg-winwin-50 text-winwin-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {status || "-"}
    </span>
  );
};

export function StaffAvatar({
  name = "",
  image,
  size = "h-11 w-11",
  text = "text-sm",
}) {
  const [failed, setFailed] = useState(false);
  const url = getImageUrl(image);

  useEffect(() => setFailed(false), [image]);

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name}
        onError={() => setFailed(true)}
        className={`${size} shrink-0 rounded-full object-cover`}
      />
    );
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`${size} ${text} flex shrink-0 items-center justify-center rounded-full bg-winwin-50 font-semibold text-winwin-600`}
    >
      {initials || "?"}
    </div>
  );
}

export default function SingleStaff({ staffId, initialData, onClose }) {
  const [staff, setStaff] = useState(initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await StaffAPI.getById(staffId);
        if (cancelled) return;
        if (res.staff && res.staff._id) setStaff(res.staff);
        else if (!initialData) setError("Staff member not found");
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load staff");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId]);

  return (
    <Modal title="Staff Details" onClose={onClose} size="lg">
      {loading && (
        <div className="mb-3 flex items-center text-xs text-slate-400">
          <Loader2 size={14} className="mr-1.5 animate-spin" />
          Fetching latest details...
        </div>
      )}

      {error && !staff ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <AlertCircle className="text-red-500" size={26} />
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      ) : (
        staff && (
          <>
            <div className="mb-6 flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
              <StaffAvatar
                name={staff.name}
                image={staff.image}
                size="h-20 w-20"
                text="text-xl"
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-slate-800">
                  {staff.name}
                </p>
                <p className="mb-1.5 truncate text-sm text-slate-500">
                  {staff.roleName || "No role assigned"}
                </p>
                <StatusBadge status={staff.status} />
              </div>
            </div>

            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {[
                ["Email", staff.email],
                ["Phone", staff.phone],
                ["Department", staff.departmentName],
                ["Role", staff.roleName],
                ["Address", staff.address],
                ["Staff ID", staff._id],
                ["Created At", formatDate(staff.createdAt)],
                ["Updated At", formatDate(staff.updatedAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5 border-b border-slate-100 pb-2"
                >
                  <dt className="text-xs text-slate-400">{label}</dt>
                  <dd className="break-all font-medium text-slate-700">
                    {value || "-"}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )
      )}
    </Modal>
  );
}