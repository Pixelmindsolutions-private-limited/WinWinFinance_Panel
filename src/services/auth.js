// src/services/auth.js

const AUTH_KEY = "winwin_auth";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://31.97.228.17:5075";

/* =========================================================
   SESSION HELPERS
========================================================= */

export function getAuth() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

function saveAuth(auth) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  return auth;
}

export function getToken() {
  return getAuth()?.token || null;
}

export function isAuthenticated(role) {
  const auth = getAuth();

  if (!auth?.token) {
    return false;
  }

  return role ? auth.role === role : true;
}

/* =========================================================
   AUTH HEADERS
========================================================= */

export function authHeaders(extra = {}) {
  const token = getToken();

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/*
  For JSON requests:

  fetch(url, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });

  For FormData:

  fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  IMPORTANT: Do NOT manually add Content-Type for FormData.
*/

/* =========================================================
   LOGOUT
========================================================= */

export function logout(navigate) {
  const authData = sessionStorage.getItem(AUTH_KEY);

  if (authData) {
    const { role } = JSON.parse(authData);

    sessionStorage.removeItem(AUTH_KEY);

    if (role === "admin") {
      navigate("/admin/login");
    } else if (role === "staff") {
      navigate("/staff/login");
    } else {
      navigate("/login");
    }
  } else {
    navigate("/login");
  }
}

/* =========================================================
   SHARED JSON POST HELPER
========================================================= */

async function postJson(path, body, method = "POST") {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("Network error:", path, error);

    throw new Error(
      "Unable to reach the server. Check your connection and try again."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Server returned non-JSON response
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Request failed. Please try again.");
  }

  return data;
}

/* =========================================================
   ADMIN LOGIN
========================================================= */

export async function loginAdmin(email, password) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/v1/winwin/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.error("Admin login network error:", error);

    throw new Error(
      "Unable to reach the server. Check your connection and try again."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    // Server returned non-JSON response
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Invalid email or password");
  }

  /*
    Backend returns:

    user: { _id, department, email, name, phone }
  */

  if (String(data.user?.department || "").toLowerCase() !== "admin") {
    throw new Error("This account does not have admin access");
  }

  if (!data.token) {
    throw new Error(
      "Login successful but authentication token was not received."
    );
  }

  return saveAuth({
    token: data.token,
    role: "admin",
    name: data.user?.name || "",
    email: data.user?.email || email,
    user: data.user || {},
  });
}

/* =========================================================
   ADMIN FORGOT PASSWORD (OTP FLOW)
========================================================= */

// Step 1: send the OTP. Returns { userId, message }
export async function generateAdminOtp(email) {
  const data = await postJson("/v1/winwin/admin/auth/generate-otp", { email });

  return {
    userId: data.userInfo,
    message: data.message,
  };
}

// Step 2: verify the OTP
export function verifyAdminOtp(userId, otp) {
  return postJson("/v1/winwin/admin/auth/compare-otp", {
    _id: userId,
    emailOtp: otp,
  });
}

// Step 3: set the new password
export function resetAdminPassword(userId, newPassword, confirmPassword) {
  return postJson(
    "/v1/winwin/admin/auth/reset-password",
    {
      userId,
      newpassword: newPassword,
      confirmpassword: confirmPassword,
    },
    "PUT"
  );
}

/* =========================================================
   STAFF LOGIN (API)
========================================================= */

export async function loginStaff(email, password) {
  const data = await postJson("/v1/winwin/admin/staff/login", {
    email,
    password,
  });

  if (!data.token) {
    throw new Error(
      "Login successful but authentication token was not received."
    );
  }

  // Never keep the password hash in the browser session
  const staff = { ...(data.staff || {}) };
  delete staff.password;

  return saveAuth({
    token: data.token,
    role: "staff",
    name: staff.name || "",
    email: staff.email || email,
    user: staff,
  });
}

/* =========================================================
   BACKWARD COMPATIBILITY
========================================================= */

export function login(role, email, password) {
  return role === "admin"
    ? loginAdmin(email, password)
    : loginStaff(email, password);
}

/* =========================================================
   CURRENT USER
========================================================= */

export function getCurrentUser() {
  return getAuth()?.user || null;
}

export function getUserRole() {
  return getAuth()?.role || null;
}

export function getUserName() {
  return getAuth()?.name || null;
}

export function getUserEmail() {
  return getAuth()?.email || null;
}

/* =========================================================
   API BASE URL
========================================================= */

export { API_BASE_URL };

/* =========================================================
   UPDATE SAVED PROFILE (keeps header/sidebar in sync)
========================================================= */

export function updateAuthProfile(changes = {}) {
  const auth = getAuth();

  if (!auth) {
    return null;
  }

  return saveAuth({
    ...auth,
    ...changes,
    user: {
      ...(auth.user || {}),
      ...changes,
    },
  });
}