import React, { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import RoleAPI from "./RoleAPI";
import {
  PERMISSION_MODULES,
  buildPermissionPayload,
  extractSelectedPaths,
  getModulePaths,
} from "./rolePermissions";

const EMPTY_FORM = { roleName: "", status: "active" };

function TriCheckbox({ checked, indeterminate, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-winwin-600"
    />
  );
}

export default function AddEditRole({ roleId, onSuccess, onCancel }) {
  const isEdit = Boolean(roleId);

  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load role in edit mode
  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await RoleAPI.getById(roleId);
        if (cancelled) return;
        if (!res.role || !res.role._id) {
          setError("Role not found");
          return;
        }
        setForm({ roleName: res.role.roleName, status: res.role.status });
        setSelected(extractSelectedPaths(res.role.rolesAndPermission));
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load role");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roleId, isEdit]);

  const allPaths = PERMISSION_MODULES.flatMap(getModulePaths);
  const allSelected = allPaths.every((p) => selected.has(p));

  const toggleModule = (mod) => {
    const paths = getModulePaths(mod);
    const everySelected = paths.every((p) => selected.has(p));
    const next = new Set(selected);
    paths.forEach((p) => (everySelected ? next.delete(p) : next.add(p)));
    setSelected(next);
  };

  const togglePath = (path) => {
    const next = new Set(selected);
    next.has(path) ? next.delete(path) : next.add(path);
    setSelected(next);
  };

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(allPaths));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.roleName.trim();
    if (!name) {
      setError("Role name is required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        roleName: name,
        status: form.status,
        rolesAndPermission: buildPermissionPayload(selected),
      };
      if (isEdit) {
        await RoleAPI.update(roleId, payload);
        onSuccess?.("Role updated successfully");
      } else {
        await RoleAPI.add(payload);
        onSuccess?.("Role created successfully");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="mr-2 animate-spin" size={20} />
        Loading role...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic details */}
      <div className="card p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-800">
          Role Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Role Name
            </label>
            <input
              type="text"
              value={form.roleName}
              onChange={(e) => setForm({ ...form, roleName: e.target.value })}
              placeholder="e.g. Team Lead"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-winwin-500 focus:ring-2 focus:ring-winwin-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-winwin-500 focus:ring-2 focus:ring-winwin-100"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="card p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Roles &amp; Permissions
            </h3>
            <p className="text-xs text-slate-400">
              Choose the menu items this role can access.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleAll}
            className="self-start rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            {allSelected ? "Clear All" : "Select All"}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {PERMISSION_MODULES.map((mod) => {
            const paths = getModulePaths(mod);
            const count = paths.filter((p) => selected.has(p)).length;
            return (
              <div
                key={mod.module}
                className="rounded-xl border border-slate-100 p-4"
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <TriCheckbox
                    checked={count === paths.length}
                    indeterminate={count > 0 && count < paths.length}
                    onChange={() => toggleModule(mod)}
                  />
                  <span className="text-sm font-semibold text-slate-800">
                    {mod.module}
                  </span>
                </label>

                {mod.subModules.length > 0 && (
                  <div className="mt-3 space-y-2 border-l border-slate-100 pl-4">
                    {mod.subModules.map((s) => (
                      <label
                        key={s.path}
                        className="flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(s.path)}
                          onChange={() => togglePath(s.path)}
                          className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-winwin-600"
                        />
                        <span className="text-sm text-slate-600">
                          {s.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary justify-center disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {isEdit ? "Save Changes" : "Create Role"}
        </button>
      </div>
    </form>
  );
}