import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Building2,
  Eye,
  Pencil,
  Trash2,
  Search,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import PageHeader from "../../../../components/common/PageHeader";
import DepartmentAPI from "./departmentAPI";

const EMPTY_FORM = { departmentName: "", status: "active" };

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const StatusBadge = ({ status }) => {
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

/* ---------- Reusable modal shell ---------- */
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
    <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-md sm:rounded-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // modal: { type: "add" | "edit" | "view" | "delete", data?: department }
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [viewLoading, setViewLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  /* ---------- Fetch all ---------- */
  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res =
        statusFilter === "active"
          ? await DepartmentAPI.getActive()
          : await DepartmentAPI.getAll();
      const list = res.departments || res.activeDepartments || [];
      setDepartments(list);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  /* ---------- Filtering ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return departments.filter((d) => {
      const matchSearch = !q || d.departmentName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [departments, search, statusFilter]);

  /* ---------- Modal helpers ---------- */
  const closeModal = () => {
    setModal(null);
    setForm(EMPTY_FORM);
    setModalError("");
    setViewLoading(false);
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModalError("");
    setModal({ type: "add" });
  };

  const openEdit = (dept) => {
    setForm({ departmentName: dept.departmentName, status: dept.status });
    setModalError("");
    setModal({ type: "edit", data: dept });
  };

  const openDelete = (dept) => {
    setModalError("");
    setModal({ type: "delete", data: dept });
  };

  const openView = async (dept) => {
    setModal({ type: "view", data: dept });
    setViewLoading(true);
    try {
      const res = await DepartmentAPI.getById(dept._id);
      if (res.department) setModal({ type: "view", data: res.department });
    } catch (err) {
      setModalError(err.message || "Failed to load department");
    } finally {
      setViewLoading(false);
    }
  };

  /* ---------- Submit (add / edit) ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.departmentName.trim();
    if (!name) {
      setModalError("Department name is required");
      return;
    }

    setSaving(true);
    setModalError("");
    try {
      const payload = { departmentName: name, status: form.status };
      if (modal.type === "add") {
        await DepartmentAPI.add(payload);
        showToast("success", "Department added successfully");
      } else {
        await DepartmentAPI.update(modal.data._id, payload);
        showToast("success", "Department updated successfully");
      }
      closeModal();
      fetchDepartments();
    } catch (err) {
      setModalError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Delete ---------- */
  const handleDelete = async () => {
    setSaving(true);
    setModalError("");
    try {
      await DepartmentAPI.remove(modal.data._id);
      showToast("success", "Department deleted successfully");
      closeModal();
      fetchDepartments();
    } catch (err) {
      setModalError(err.message || "Failed to delete department");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Render ---------- */
  return (
    <div>
      <PageHeader
        title="Department Management"
        description="Create, view, edit and remove departments."
        action={
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={16} />
            Add Department
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
            placeholder="Search departments..."
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
            onClick={fetchDepartments}
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
          Loading departments...
        </div>
      ) : error ? (
        <div className="card flex flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="text-red-500" size={28} />
          <p className="text-sm text-slate-600">{error}</p>
          <button className="btn-primary" onClick={fetchDepartments}>
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <Building2 className="text-slate-300" size={32} />
          <p className="text-sm text-slate-500">No departments found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((dept) => (
            <div key={dept._id} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-winwin-50 text-winwin-600">
                  <Building2 size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800">
                    {dept.departmentName}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    Created {formatDate(dept.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <StatusBadge status={dept.status} />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openView(dept)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-winwin-50 hover:text-winwin-600"
                    aria-label="View"
                    title="View"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEdit(dept)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-winwin-50 hover:text-winwin-600"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => openDelete(dept)}
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

      {/* Add / Edit modal */}
      {modal && (modal.type === "add" || modal.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Department" : "Edit Department"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Department Name
              </label>
              <input
                type="text"
                value={form.departmentName}
                onChange={(e) =>
                  setForm({ ...form, departmentName: e.target.value })
                }
                placeholder="e.g. Human Resources"
                autoFocus
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

            {modalError && (
              <p className="flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle size={14} />
                {modalError}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
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
                {modal.type === "add" ? "Add Department" : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View modal */}
      {modal && modal.type === "view" && (
        <Modal title="Department Details" onClose={closeModal}>
          {viewLoading && (
            <div className="mb-3 flex items-center text-xs text-slate-400">
              <Loader2 size={14} className="mr-1.5 animate-spin" />
              Fetching latest details...
            </div>
          )}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-winwin-50 text-winwin-600">
              <Building2 size={22} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                {modal.data.departmentName}
              </p>
              <StatusBadge status={modal.data.status} />
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            {[
              ["Department ID", modal.data._id],
              ["Created By", modal.data.createdBy],
              ["Created At", formatDate(modal.data.createdAt)],
              ["Updated At", formatDate(modal.data.updatedAt)],
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

          {modalError && (
            <p className="mt-3 text-sm text-red-600">{modalError}</p>
          )}
        </Modal>
      )}

      {/* Delete modal */}
      {modal && modal.type === "delete" && (
        <Modal title="Delete Department" onClose={closeModal}>
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {modal.data.departmentName}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          {modalError && (
            <p className="mb-3 text-center text-sm text-red-600">
              {modalError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={closeModal}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}