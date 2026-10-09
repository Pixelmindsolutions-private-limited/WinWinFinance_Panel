import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    CheckCircle2,
    FileText,
    Loader2,
    Pencil,
    RefreshCw,
    RotateCcw,
    Save,
    ShieldCheck,
    X,
} from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import SettingsAPI from "../../../services/SettingsAPI";

// Defined once, outside the component, so nothing is re-created per render
const TABS = [
    {
        key: "privacyPolicy",
        label: "Privacy Policy",
        icon: ShieldCheck,
        description: "How user data is collected, used and protected.",
        placeholder: "Write your privacy policy here...",
        save: SettingsAPI.updatePrivacy,
    },
    {
        key: "termsAndCondition",
        label: "Terms & Conditions",
        icon: FileText,
        description: "The terms users must accept to use the platform.",
        placeholder: "Write your terms and conditions here...",
        save: SettingsAPI.updateTerms,
    },
];

const EMPTY = { termsAndCondition: "", privacyPolicy: "" };

const dateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
});

const formatModified = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "-" : dateFmt.format(d).toUpperCase();
};

export default function Policies() {
    const [activeKey, setActiveKey] = useState(TABS[0].key);
    const [editingKey, setEditingKey] = useState(null); // which policy is in edit mode (null = all view-only)
    const [saved, setSaved] = useState(EMPTY); // last value from the server
    const [draft, setDraft] = useState(EMPTY); // what's in the textarea while editing
    const [modified, setModified] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const tab = TABS.find((t) => t.key === activeKey);
    const isEditing = editingKey === activeKey;
    const isDirty = (key) => draft[key] !== saved[key];
    const anyDirty = TABS.some((t) => isDirty(t.key));

    // Single GET for both policies
    const fetchSettings = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await SettingsAPI.get();
            const s = res.settings;
            if (!s) throw new Error("Settings not found");

            const next = {
                termsAndCondition: s.termsAndCondition || "",
                privacyPolicy: s.privacyPolicy || "",
            };
            setSaved(next);
            setDraft(next);
            setEditingKey(null);
            setModified(s.logModifiedDate || s.updatedAt || "");
        } catch (err) {
            setError(err.message || "Failed to load policies");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Auto-hide the success message
    useEffect(() => {
        if (!notice) return undefined;
        const id = setTimeout(() => setNotice(""), 3000);
        return () => clearTimeout(id);
    }, [notice]);

    const handleEdit = () => {
        setError("");
        setNotice("");
        setEditingKey(activeKey);
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setDraft((prev) => ({ ...prev, [activeKey]: value }));
    };

    // Revert the textarea to the last saved text but stay in edit mode
    const handleReset = () => {
        setDraft((prev) => ({ ...prev, [activeKey]: saved[activeKey] }));
        setError("");
    };

    // Discard changes and go back to view-only
    const handleCancel = () => {
        if (isDirty(activeKey) && !window.confirm("Discard your unsaved changes?")) {
            return;
        }
        setDraft((prev) => ({ ...prev, [activeKey]: saved[activeKey] }));
        setEditingKey(null);
        setError("");
    };

    const handleRefresh = () => {
        if (anyDirty && !window.confirm("Discard all unsaved changes?")) return;
        fetchSettings();
    };

    // Only the active policy is sent, via its own endpoint
    const handleSave = async () => {
        setSaving(true);
        setError("");
        setNotice("");
        const value = draft[activeKey];
        try {
            const res = await tab.save(value);
            setSaved((prev) => ({ ...prev, [activeKey]: value }));
            setModified(res?.settings?.logModifiedDate || new Date().toISOString());
            setEditingKey(null); // back to view-only after a successful save
            setNotice(`${tab.label} updated successfully.`);
        } catch (err) {
            setError(err.message || `Failed to update ${tab.label}`);
        } finally {
            setSaving(false);
        }
    };

    const value = draft[activeKey];
    const dirty = isDirty(activeKey);
    const canSave = dirty && value.trim() !== "" && !saving;
    const savedText = saved[activeKey];

    return (
        <div className="w-full min-w-0">
            <PageHeader
                title="Policies"
                description="Manage the terms & conditions and privacy policy."
                action={
                    <button
                        onClick={handleRefresh}
                        disabled={loading || saving}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                }
            />

            {loading && !modified && saved === EMPTY ? (
                <div className="flex items-center justify-center py-20 text-slate-400">
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Loading policies...
                </div>
            ) : saved === EMPTY && error ? (
                <div className="card mx-auto flex max-w-2xl flex-col items-center gap-3 p-8 text-center">
                    <AlertCircle className="text-red-500" size={28} />
                    <p className="text-sm text-slate-600">{error}</p>
                    <button className="btn-primary" onClick={fetchSettings}>
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="w-full min-w-0 space-y-4">
                    {/* Nav selection */}
                    <div
                        role="tablist"
                        aria-label="Policies"
                        className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm sm:grid-cols-2"
                    >
                        {TABS.map(({ key, label, icon: Icon }) => {
                            const active = key === activeKey;
                            return (
                                <button
                                    key={key}
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setActiveKey(key)}
                                    className={`relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${active
                                            ? "bg-winwin-600 text-white shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                    {isDirty(key) && (
                                        <span
                                            title="Unsaved changes"
                                            className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-amber-500"
                                                }`}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Banners */}
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

                    {/* Content card */}
                    <div className="card p-5 sm:p-6">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-sm font-semibold text-slate-800">
                                        {tab.label}
                                    </h3>
                                    {isEditing && (
                                        <span className="rounded-full bg-winwin-50 px-2 py-0.5 text-[11px] font-medium text-winwin-600">
                                            Editing
                                        </span>
                                    )}
                                </div>
                                <p className="mt-0.5 text-xs text-slate-400">
                                    {tab.description}
                                </p>
                                {modified && (
                                    <p className="mt-1 text-xs text-slate-400">
                                        Last updated: {formatModified(modified)}
                                    </p>
                                )}
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={handleEdit}
                                    className="btn-primary inline-flex items-center justify-center gap-2 sm:shrink-0"
                                >
                                    <Pencil size={16} />
                                    Edit
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <>
                                <textarea
                                    value={value}
                                    onChange={handleChange}
                                    disabled={saving}
                                    placeholder={tab.placeholder}
                                    spellCheck
                                    autoFocus
                                    className="min-h-[320px] w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-winwin-600 focus:ring-2 focus:ring-winwin-600/20 disabled:bg-slate-50 sm:min-h-[420px]"
                                />

                                <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-center text-xs text-slate-400 sm:text-left">
                                        {value.length.toLocaleString("en-IN")} characters
                                        {dirty && (
                                            <span className="ml-2 font-medium text-amber-600">
                                                · Unsaved changes
                                            </span>
                                        )}
                                    </p>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <X size={16} />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            disabled={!dirty || saving}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <RotateCcw size={16} />
                                            Reset
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={!canSave}
                                            className="btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {saving ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Save size={16} />
                                            )}
                                            {saving ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : savedText.trim() ? (
                            /* View-only */
                            <div className="max-h-[560px] overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700">
                                {savedText}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 py-14 text-center text-slate-400">
                                <tab.icon size={28} />
                                <p className="text-sm">No content added yet.</p>
                                <p className="text-xs">
                                    Click Edit to write the {tab.label.toLowerCase()}.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}