import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import PageHeader from "../../../../components/common/PageHeader";
import Pagination from "../../../../components/common/Pagination";
import FAQAPI from "../../../../services/FaqAPI";
import CreateEditFAQ from "./CreateEditFAQs";

const PAGE_SIZE = 10;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : dateFmt.format(d);
};

function FAQStatus({ status }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {status || "-"}
    </span>
  );
}

const FAQItem = memo(function FAQItem({
  faq,
  open,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <li className="px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onToggle(faq._id)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-winwin-50 text-winwin-600">
            <HelpCircle size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block break-words text-sm font-semibold text-slate-800">
              {faq.question}
            </span>
            <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <FAQStatus status={faq.status} />
              <span className="text-xs text-slate-400">
                Updated {formatDate(faq.logModifiedDate)}
              </span>
            </span>
          </span>
          <ChevronDown
            size={18}
            className={`mt-1.5 shrink-0 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(faq)}
            aria-label="Edit FAQ"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-winwin-600"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(faq)}
            aria-label="Delete FAQ"
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600 sm:ml-11">
          {faq.answer}
        </div>
      )}
    </li>
  );
});

function ConfirmDelete({ faq, busy, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 size={18} />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">
          Delete this FAQ?
        </h3>
        <p className="mt-1 break-words text-sm text-slate-500">
          “{faq.question}” will be permanently removed. This can't be undone.
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const [modal, setModal] = useState({ open: false, faq: null });
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await FAQAPI.getAll();
      setFaqs(Array.isArray(res?.faqs) ? res.faqs : []);
    } catch (err) {
      setError(err.message || "Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-hide the success message
  useEffect(() => {
    if (!notice) return undefined;
    const id = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(id);
  }, [notice]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter(
      (f) =>
        (filter === "all" || f.status === filter) &&
        (!q ||
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q))
    );
  }, [faqs, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const rows = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  // Stable handlers so memoized rows don't re-render needlessly
  const handleToggle = useCallback(
    (id) => setExpandedId((prev) => (prev === id ? null : id)),
    []
  );
  const handleEdit = useCallback((faq) => {
    setNotice("");
    setModal({ open: true, faq });
  }, []);
  const handleAdd = useCallback(() => {
    setNotice("");
    setModal({ open: true, faq: null });
  }, []);
  const closeModal = useCallback(() => setModal({ open: false, faq: null }), []);
  const handleSaved = useCallback(
    (message) => {
      setModal({ open: false, faq: null });
      setNotice(message);
      load();
    },
    [load]
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await FAQAPI.remove(toDelete._id);
      setFaqs((prev) => prev.filter((f) => f._id !== toDelete._id));
      setNotice("FAQ deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete FAQ");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const hasData = faqs.length > 0;

  return (
    <div className="w-full min-w-0">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={handleAdd}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add FAQ
            </button>
          </div>
        }
      />

      {loading && !hasData ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Loading FAQs...
        </div>
      ) : error && !hasData ? (
        <div className="card mx-auto flex max-w-2xl flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="text-red-500" size={28} />
          <p className="text-sm text-slate-600">{error}</p>
          <button className="btn-primary" onClick={load}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="w-full min-w-0 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {notice && (
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {/* Search + status filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search questions or answers..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-winwin-600 focus:ring-2 focus:ring-winwin-600/20"
              />
            </div>

            <div
              role="tablist"
              aria-label="Filter by status"
              className="grid grid-cols-3 gap-1 rounded-xl border border-slate-100 bg-white p-1 shadow-sm sm:inline-grid"
            >
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={filter === key}
                  onClick={() => {
                    setFilter(key);
                    setPage(1);
                  }}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                    filter === key
                      ? "bg-winwin-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="card w-full min-w-0 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-16 text-center text-slate-400">
                <HelpCircle size={28} />
                <p className="text-sm">
                  {hasData ? "No FAQs match your search." : "No FAQs added yet."}
                </p>
                {!hasData && (
                  <button className="btn-primary mt-2" onClick={handleAdd}>
                    Add your first FAQ
                  </button>
                )}
              </div>
            ) : (
              <>
                <ul className="divide-y divide-slate-100">
                  {rows.map((faq) => (
                    <FAQItem
                      key={faq._id}
                      faq={faq}
                      open={expandedId === faq._id}
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                      onDelete={setToDelete}
                    />
                  ))}
                </ul>

                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  totalItems={filtered.length}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      )}

      {modal.open && (
        <CreateEditFAQ
          faq={modal.faq}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}

      {toDelete && (
        <ConfirmDelete
          faq={toDelete}
          busy={deleting}
          onCancel={() => setToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}