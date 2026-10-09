import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Save, X } from "lucide-react";
import FAQAPI from "../../../../services/FaqAPI";

const STATUSES = [
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
];

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-winwin-600 focus:ring-2 focus:ring-winwin-600/20 disabled:bg-slate-50";

/**
 * Add / edit modal.
 * - faq: existing FAQ to edit, or null/undefined to create
 * - onClose: must be a stable reference (useCallback in the parent)
 * - onSaved(message): called after a successful save
 * Render it only while open so its state starts fresh each time.
 */
export default function CreateEditFAQ({ faq, onClose, onSaved }) {
  const isEdit = Boolean(faq?._id);

  const [form, setForm] = useState({
    question: faq?.question || "",
    answer: faq?.answer || "",
    status: faq?.status || "active",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Esc to close + lock background scroll while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, saving]);

  const unchanged =
    isEdit &&
    form.question.trim() === faq.question &&
    form.answer.trim() === faq.answer &&
    form.status === faq.status;

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  };

  const validate = () => {
    const next = {};
    if (!form.question.trim()) next.question = "Question is required";
    if (!form.answer.trim()) next.answer = "Answer is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || !validate()) return;

    setSaving(true);
    setError("");
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      status: form.status,
    };

    try {
      if (isEdit) await FAQAPI.update(faq._id, payload);
      else await FAQAPI.add(payload);
      // Parent closes the modal, so no state update needed here
      onSaved(isEdit ? "FAQ updated successfully." : "FAQ added successfully.");
    } catch (err) {
      setError(err.message || "Failed to save FAQ");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-modal-title"
        className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h2
            id="faq-modal-title"
            className="text-base font-semibold text-slate-900"
          >
            {isEdit ? "Edit FAQ" : "Add FAQ"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="faq-question"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Question
            </label>
            <input
              id="faq-question"
              type="text"
              value={form.question}
              onChange={(e) => setField("question", e.target.value)}
              disabled={saving}
              autoFocus
              placeholder="e.g. How can I reset my password?"
              className={`${inputCls} ${
                errors.question ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.question && (
              <p className="mt-1 text-xs text-red-600">{errors.question}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="faq-answer"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Answer
            </label>
            <textarea
              id="faq-answer"
              rows={6}
              value={form.answer}
              onChange={(e) => setField("answer", e.target.value)}
              disabled={saving}
              placeholder="Write the answer here..."
              className={`${inputCls} resize-y leading-relaxed ${
                errors.answer ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.answer && (
              <p className="mt-1 text-xs text-red-600">{errors.answer}</p>
            )}
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </span>
            <div
              role="radiogroup"
              aria-label="Status"
              className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1"
            >
              {STATUSES.map(({ key, label }) => {
                const active = form.status === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={saving}
                    onClick={() => setField("status", key)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-winwin-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || unchanged}
            className="btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : isEdit ? "Update FAQ" : "Add FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
}