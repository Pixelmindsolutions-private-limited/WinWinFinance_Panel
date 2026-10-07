import { getToken } from "../../../../services/auth";

const BASE_URL = "http://31.97.228.17:5075/v1/winwin/admin/department";

// Change this key if your login helper stores the token under a different name
const TOKEN_KEY = getToken();

async function request(path, { method = "GET", body } = {}) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
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

const DepartmentAPI = {
  // POST /adddepartment  { departmentName, status }
  add: (payload) =>
    request("/adddepartment", { method: "POST", body: payload }),

  // GET /getall-departments
  getAll: () => request("/getall-departments", { method: "POST" }),

  // POST /getdepartmentbyid  { id }
  getById: (id) =>
    request("/getdepartmentbyid", { method: "POST", body: { id } }),

  // GET /getall-activedepartments
  getActive: () => request("/getall-activedepartments", { method: "POST" }),

  // PUT /updatedepartment/:id  { departmentName, status }
  update: (id, payload) =>
    request(`/updatedepartment/${id}`, { method: "PUT", body: payload }),

  // DELETE /deletedepartment/:id
  remove: (id) => request(`/deletedepartment/${id}`, { method: "DELETE" }),
};

export default DepartmentAPI;