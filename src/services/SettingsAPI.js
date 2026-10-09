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

const SettingsAPI = {
  // POST /setting/get -> { settings: { termsAndCondition, privacyPolicy, ... } }
  get: () => request("/setting/get", { method: "POST" }),

  // PUT /setting/update-terms  { termsAndCondition }
  updateTerms: (termsAndCondition) =>
    request("/setting/update-terms", {
      method: "PUT",
      body: { termsAndCondition },
    }),

  // PUT /setting/updateprivacypolicy  { privacyPolicy }
  updatePrivacy: (privacyPolicy) =>
    request("/setting/updateprivacypolicy", {
      method: "PUT",
      body: { privacyPolicy },
    }),
};

export default SettingsAPI;