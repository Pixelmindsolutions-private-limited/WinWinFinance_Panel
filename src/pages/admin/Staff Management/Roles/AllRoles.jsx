import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  ShieldCheck,
  Eye,
  Pencil,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import PageHeader from "../../../../components/common/PageHeader";
import Modal from "../../../../components/common/Modal";
import RoleAPI from "./RoleAPI";
import SingleRole, { StatusBadge, formatDate } from "./SingleRole";
import {
  ROLES_BASE_PATH,
  countPermissions,
} from "./rolePermissions";

export default function AllRoles() {
  const navigate = useNavigate();
  const location = useLocation();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [viewRole, setViewRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Toast coming from Create / Edit page
  useEffect(() => {
    if (location.state?.message) {
      showToast("success", location.state.message);
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res =
        statusFilter === "active"
          ? await RoleAPI.getActive()
          : await RoleAPI.getAll();
      setRoles(res.roles || res.activeRoles || []);
    } catch (err) {
      setError(err.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roles.filter((r) => {
      const matchSearch = !q || r.roleName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [roles, search, statusFilter]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await RoleAPI.remove(deleteRole._id);
      showToast("success", "Role deleted successfully");
      setDeleteRole(null);
      fetchRoles();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete role");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Role Management"
        description="Manage roles and the permissions assigned to them."
        action={
          <button
            className="btn-primary"
            onClick={() => navigate(`${ROLES_BASE_PATH}/create`)}
          >
            <Plus size={16} />
            Create Role
          </button>
        }
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-[60] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-winwin-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.message}
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-winwin-500 focus:ring-2 focus:ring-winwin-100"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-winwin-500 focus:ring-2 focus:ring-winwin-100 sm:flex-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={fetchRoles}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50"
            aria-label="Refresh"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Loading roles...
        </div>
      ) : error ? (
        <div className="card flex flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="text-red-500" size={28} />
          <p className="text-sm text-slate-600">{error}</p>
          <button className="btn-primary" onClick={fetchRoles}>
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <ShieldCheck className="text-slate-300" size={32} />
          <p className="text-sm text-slate-500">No roles found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((role) => {
            const permCount = countPermissions(role.rolesAndPermission);
            return (
              <div key={role._id} className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-winwin-50 text-winwin-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">
                      {role.roleName}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      Created {formatDate(role.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    {permCount} {permCount === 1 ? "permission" : "permissions"}
                  </span>
                  <StatusBadge status={role.status} />
                </div>

                <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setViewRole(role)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-winwin-50 hover:text-winwin-600"
                    aria-label="View"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`${ROLES_BASE_PATH}/edit/${role._id}`)
                    }
                    className="rounded-lg p-2 text-slate-500 hover:bg-winwin-50 hover:text-winwin-600"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteError("");
                      setDeleteRole(role);
                    }}
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View modal */}
      {viewRole && (
        <SingleRole
          roleId={viewRole._id}
          initialData={viewRole}
          onClose={() => setViewRole(null)}
        />
      )}

      {/* Delete modal */}
      {deleteRole && (
        <Modal title="Delete Role" onClose={() => setDeleteRole(null)}>
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteRole.roleName}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          {deleteError && (
            <p className="mb-3 text-center text-sm text-red-600">
              {deleteError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={() => setDeleteRole(null)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting && <Loader2 size={16} className="animate-spin" />}
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}