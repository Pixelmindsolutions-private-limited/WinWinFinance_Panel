import { getToken } from "../../../../services/auth";

const BASE_URL = "http://31.97.228.17:5075/v1/winwin/admin/role";

// Change this key if your login helper stores the token under a different name
const TOKEN_KEY = getToken();

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
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

const RoleAPI = {
  // POST /addrole  { roleName, status, rolesAndPermission }
  add: (payload) => request("/addrole", { method: "POST", body: payload }),

  // POST /getall-roles  -> { roles }
  getAll: () => request("/getall-roles", { method: "POST" }),

  // POST /getall-activeroles  -> { activeRoles }
  getActive: () => request("/getall-activeroles", { method: "POST" }),

  // POST /getrolebyid  { id }  -> { role }
  getById: (id) => request("/getrolebyid", { method: "POST", body: { id } }),

  // PUT /updaterole/:id  { roleName, status, rolesAndPermission }
  update: (id, payload) =>
    request(`/updaterole/${id}`, { method: "PUT", body: payload }),

  // DELETE /deleterole/:id
  remove: (id) => request(`/deleterole/${id}`, { method: "DELETE" }),
};

export default RoleAPI;