import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import PageHeader from "../../../../components/common/PageHeader";
import StaffAPI, { getImageUrl } from "../../../../services/StaffAPI";
import { StaffAvatar, STAFF_BASE_PATH } from "./SingleStaff";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  password: "",
  departmentId: "",
  roleId: "",
  address: "",
};

const MAX_IMAGE_MB = 2;

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-winwin-500 focus:ring-2 focus:ring-winwin-100";

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default function CreateEditStaff() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const fileRef = useRef(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [existing, setExisting] = useState(null); // staff being edited
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const goBack = () => navigate(STAFF_BASE_PATH);

  /* ---------- Load dropdowns (+ staff in edit mode) ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [deptRes, roleRes, staffRes] = await Promise.all([
          StaffAPI.getActiveDepartments(),
          StaffAPI.getActiveRoles(),
          isEdit ? StaffAPI.getById(id) : Promise.resolve(null),
        ]);
        if (cancelled) return;

        setDepartments(deptRes.activeDepartments || deptRes.departments || []);
        setRoles(roleRes.activeRoles || roleRes.roles || []);

        if (isEdit) {
          const s = staffRes?.staff;
          if (!s || !s._id) {
            setError("Staff member not found");
          } else {
            setExisting(s);
            setForm({
              name: s.name || "",
              phone: s.phone || "",
              email: s.email || "",
              password: "", // never prefill
              departmentId: s.departmentId || "",
              roleId: s.roleId || "",
              address: s.address || "",
            });
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load form data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  // Free the object URL when the preview changes
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: "" }));
  };

  /* ---------- Image ---------- */
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((er) => ({ ...er, image: "Please choose an image file" }));
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((er) => ({
        ...er,
        image: `Image must be under ${MAX_IMAGE_MB} MB`,
      }));
      return;
    }
    setErrors((er) => ({ ...er, image: "" }));
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ---------- Validation ---------- */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone.trim()))
      e.phone = "Enter a valid 10-digit phone number";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      e.email = "Enter a valid email address";
    if (!isEdit && form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (isEdit && form.password && form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (!form.departmentId) e.departmentId = "Select a department";
    if (!form.roleId) e.roleId = "Select a role";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors((prev) => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError("");
    if (!validate()) return;

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("phone", form.phone.trim());
    fd.append("email", form.email.trim());
    fd.append("departmentId", form.departmentId);
    fd.append("roleId", form.roleId);
    fd.append("address", form.address.trim());
    // On edit, only send the password when a new one was typed
    if (form.password) fd.append("password", form.password);
    // On edit, only send the image when a new one was picked
    if (imageFile) fd.append("image", imageFile);

    setSaving(true);
    try {
      if (isEdit) {
        await StaffAPI.update(id, fd);
        navigate(STAFF_BASE_PATH, {
          state: { message: "Staff updated successfully" },
        });
      } else {
        await StaffAPI.add(fd);
        navigate(STAFF_BASE_PATH, {
          state: { message: "Staff created successfully" },
        });
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Render ---------- */
  const headerAction = (
    <button
      onClick={goBack}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );

  // Keep the saved department / role selectable even if no longer "active"
  const deptMissing =
    form.departmentId &&
    existing &&
    !departments.some((d) => d._id === form.departmentId);
  const roleMissing =
    form.roleId && existing && !roles.some((r) => r._id === form.roleId);

  return (
    <div>
      <PageHeader
        title={isEdit ? "Edit Staff" : "Add Staff"}
        description={
          isEdit
            ? "Update the staff member's details and access."
            : "Create a new staff account with a department and role."
        }
        action={headerAction}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Loading...
        </div>
      ) : isEdit && !existing ? (
        <div className="card flex flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="text-red-500" size={28} />
          <p className="text-sm text-slate-600">{error || "Staff not found"}</p>
          <button className="btn-primary" onClick={goBack}>
            Back to Staff
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo */}
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              Profile Photo
            </h3>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <StaffAvatar
                    name={form.name}
                    image={existing?.image}
                    size="h-24 w-24"
                    text="text-2xl"
                  />
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 rounded-full bg-winwin-600 p-2 text-white shadow hover:bg-winwin-700"
                  aria-label="Choose photo"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div className="text-center sm:text-left">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {preview || existing?.image ? "Change Photo" : "Upload Photo"}
                  </button>
                  {preview && (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
                    >
                      <X size={12} />
                      Remove
                    </button>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  JPG or PNG, up to {MAX_IMAGE_MB} MB.
                  {isEdit && " Leave unchanged to keep the current photo."}
                </p>
                {errors.image && (
                  <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">
              Staff Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" required error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="e.g. Ravi Kumar"
                  className={inputCls}
                />
              </Field>

              <Field label="Phone" required error={errors.phone}>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      phone: e.target.value.replace(/\D/g, ""),
                    }));
                    setErrors((er) => ({ ...er, phone: "" }));
                  }}
                  placeholder="10-digit mobile number"
                  className={inputCls}
                />
              </Field>

              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="name@company.com"
                  className={inputCls}
                />
              </Field>

              <Field
                label={isEdit ? "New Password" : "Password"}
                required={!isEdit}
                error={errors.password}
              >
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={setField("password")}
                    placeholder={
                      isEdit ? "Leave blank to keep current" : "Min. 6 characters"
                    }
                    autoComplete="new-password"
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>

              <Field label="Department" required error={errors.departmentId}>
                <select
                  value={form.departmentId}
                  onChange={setField("departmentId")}
                  className={inputCls}
                >
                  <option value="">Select department</option>
                  {deptMissing && (
                    <option value={form.departmentId}>
                      {existing?.departmentName || "Current department"}
                    </option>
                  )}
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Role" required error={errors.roleId}>
                <select
                  value={form.roleId}
                  onChange={setField("roleId")}
                  className={inputCls}
                >
                  <option value="">Select role</option>
                  {roleMissing && (
                    <option value={form.roleId}>
                      {existing?.roleName || "Current role"}
                    </option>
                  )}
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.roleName}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="sm:col-span-2">
                <Field label="Address" required error={errors.address}>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={setField("address")}
                    placeholder="Street, area, city"
                    className={`${inputCls} resize-none`}
                  />
                </Field>
              </div>
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
              onClick={goBack}
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
              {isEdit ? "Save Changes" : "Create Staff"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}