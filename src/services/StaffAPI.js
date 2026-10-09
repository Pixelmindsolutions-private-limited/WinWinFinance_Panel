import { getToken } from "./auth";

const HOST = "http://31.97.228.17:5075";
const BASE_URL = `${HOST}/v1/winwin/admin`;

// Change this key if your login helper stores the token under a different name
const TOKEN_KEY = getToken();

// "uploads/staffProfileImg/xxx.jpg" -> full URL
export const getImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${HOST}/${path.replace(/^\/+/, "")}`;
};

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const headers = { Authorization: `Bearer ${getToken()}` };
  // For FormData the browser sets Content-Type (with boundary) itself
  if (body && !isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: isForm ? body : JSON.stringify(body) } : {}),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok || (data && data.success === false)) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

const StaffAPI = {
  // POST /staff/addstaff  (multipart/form-data)
  add: (formData) =>
    request("/staff/addstaff", { method: "POST", body: formData, isForm: true }),

  // POST /staff/getall-staff  -> { staff }
  getAll: () => request("/staff/getall-staff", { method: "POST" }),

  // POST /staff/getall-active-staff  -> { staff }
  getActive: () => request("/staff/getall-active-staff", { method: "POST" }),

  // POST /staff/getstaffbyid  { staffId }  -> { staff }
  getById: (staffId) =>
    request("/staff/getstaffbyid", { method: "POST", body: { staffId } }),

  // PUT /staff/updatestaff/:id  (multipart/form-data)
  update: (id, formData) =>
    request(`/staff/updatestaff/${id}`, {
      method: "PUT",
      body: formData,
      isForm: true,
    }),

  // DELETE /staff/deletestaff/:id
  remove: (id) => request(`/staff/deletestaff/${id}`, { method: "DELETE" }),

  // Dropdown data for the staff form
  // POST /department/getall-activedepartments -> { activeDepartments }
  getActiveDepartments: () =>
    request("/department/getall-activedepartments", { method: "POST" }),

  // POST /role/getall-activeroles -> { activeRoles }
  getActiveRoles: () =>
    request("/role/getall-activeroles", { method: "POST" }),

  // POST /staff/getprofile  (uses the logged-in staff's token) -> { staff }
  getProfile: () => request("/staff/getprofile", { method: "POST" }),

  // POST /staff/get-logs -> { logs }
  getLogs: () => request("/staff/get-logs", { method: "POST" }),
};

export default StaffAPI;