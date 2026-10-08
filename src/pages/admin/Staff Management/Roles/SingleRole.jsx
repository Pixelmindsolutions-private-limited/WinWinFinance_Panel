import React, { useEffect, useState } from "react";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import Modal from "../../../../components/common/Modal";
import RoleAPI from "./RoleAPI";

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
      {status}
    </span>
  );
};

export default function SingleRole({ roleId, initialData, onClose }) {
  const [role, setRole] = useState(initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await RoleAPI.getById(roleId);
        if (cancelled) return;
        if (res.role && res.role._id) setRole(res.role);
        else if (!initialData) setError("Role not found");
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load role");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  const permissions = role?.rolesAndPermission || [];

  return (
    <Modal title="Role Details" onClose={onClose} size="lg">
      {loading && (
        <div className="mb-3 flex items-center text-xs text-slate-400">
          <Loader2 size={14} className="mr-1.5 animate-spin" />
          Fetching latest details...
        </div>
      )}

      {error && !role ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <AlertCircle className="text-red-500" size={26} />
          <p className="text-sm text-slate-600">{error}</p>
        </div>
      ) : (
        role && (
          <>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-winwin-50 text-winwin-600">
                <ShieldCheck size={22} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">
                  {role.roleName}
                </p>
                <StatusBadge status={role.status} />
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              {[
                ["Role ID", role._id],
                ["Created At", formatDate(role.createdAt)],
                ["Updated At", formatDate(role.updatedAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-0.5 border-b border-slate-100 pb-2 sm:flex-row sm:justify-between"
                >
                  <dt className="text-slate-400">{label}</dt>
                  <dd className="break-all font-medium text-slate-700 sm:text-right">
                    {value || "-"}
                  </dd>
                </div>
              ))}
            </dl>

            <h4 className="mb-3 mt-6 text-sm font-semibold text-slate-800">
              Permissions
            </h4>
            {permissions.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-400">
                No permissions assigned to this role.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {permissions.map((p, i) => {
                  const subs = p.subModules || [];
                  return (
                    <div
                      key={`${p.module}-${i}`}
                      className="rounded-xl border border-slate-100 p-3"
                    >
                      <p className="text-sm font-medium text-slate-700">
                        {p.module}
                      </p>
                      {subs.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {subs.map((s) => (
                            <span
                              key={s.path}
                              className="rounded-full bg-winwin-50 px-2.5 py-1 text-xs font-medium text-winwin-700"
                            >
                              {s.label}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 break-all text-xs text-slate-400">
                          {p.path}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )
      )}
    </Modal>
  );
}