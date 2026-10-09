import { getToken } from "./auth";

const HOST = "http://31.97.228.17:5075";
const BASE_URL = `${HOST}/v1/winwin/admin`;

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

const AdminAPI = {
  // POST /auth/get-logs -> { logs }
  getLogs: () => request("/auth/get-logs", { method: "POST" }),
};

export default AdminAPI;