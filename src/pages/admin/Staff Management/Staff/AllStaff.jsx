import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Plus,
  UserCog,
  Eye,
  Pencil,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import PageHeader from "../../../../components/common/PageHeader";
import Modal from "../../../../components/common/Modal";
import StaffAPI from "../../../../services/StaffAPI";
import SingleStaff, {
  StaffAvatar,
  StatusBadge,
  STAFF_BASE_PATH,
} from "./SingleStaff";

const selectCls =
  "flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-winwin-500 focus:ring-2 focus:ring-winwin-100 sm:flex-none";

export default function AllStaff() {
  const navigate = useNavigate();
  const location = useLocation();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const [viewStaff, setViewStaff] = useState(null);
  const [deleteStaff, setDeleteStaff] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Toast coming from the create / edit page
  useEffect(() => {
    if (location.state?.message) {
      showToast("success", location.state.message);
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res =
        statusFilter === "active"
          ? await StaffAPI.getActive()
          : await StaffAPI.getAll();
      setStaff(res.staff || []);
    } catch (err) {
      setError(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const departments = useMemo(
    () => [...new Set(staff.map((s) => s.departmentName).filter(Boolean))],
    [staff]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter((s) => {
      const matchSearch =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchDept = deptFilter === "all" || s.departmentName === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [staff, search, statusFilter, deptFilter]);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await StaffAPI.remove(deleteStaff._id);
      showToast("success", "Staff deleted successfully");
      setDeleteStaff(null);
      fetchStaff();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete staff");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Staff Management"
        description="Manage staff accounts, roles and access."
        action={
          <button
            className="btn-primary"
            onClick={() => navigate(`${STAFF_BASE_PATH}/create`)}
          >
            <Plus size={16} />
            Add Staff
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
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-winwin-500 focus:ring-2 focus:ring-winwin-100"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className={selectCls}
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectCls}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={fetchStaff}
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
          Loading staff...
        </div>
      ) : error ? (
        <div className="card flex flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="text-red-500" size={28} />
          <p className="text-sm text-slate-600">{error}</p>
          <button className="btn-primary" onClick={fetchStaff}>
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <UserCog className="text-slate-300" size={32} />
          <p className="text-sm text-slate-500">No staff found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div key={item._id} className="card p-5">
              <div className="flex items-center gap-3">
                <StaffAvatar name={item.name} image={item.image} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">
                    {item.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {item.departmentName || "No department"}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                <p className="flex items-center gap-2 truncate">
                  <Mail size={14} className="shrink-0 text-slate-400" />
                  <span className="truncate">{item.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} className="shrink-0 text-slate-400" />
                  {item.phone}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="truncate rounded-full bg-winwin-50 px-2.5 py-1 text-xs font-medium text-winwin-700">
                  {item.roleName || "No role"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewStaff(item)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-winwin-50 hover:text-winwin-600"
                    aria-label="View"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`${STAFF_BASE_PATH}/edit/${item._id}`)
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
                      setDeleteStaff(item);
                    }}
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View modal */}
      {viewStaff && (
        <SingleStaff
          staffId={viewStaff._id}
          initialData={viewStaff}
          onClose={() => setViewStaff(null)}
        />
      )}

      {/* Delete modal */}
      {deleteStaff && (
        <Modal title="Delete Staff" onClose={() => setDeleteStaff(null)}>
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteStaff.name}
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
              onClick={() => setDeleteStaff(null)}
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