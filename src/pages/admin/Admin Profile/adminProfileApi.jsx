// src/services/adminProfile.js
import { API_BASE_URL, authHeaders } from "../../../services/auth";

async function request(path, { method = "GET", json, formData } = {}) {
    // JSON requests set Content-Type; FormData must NOT (the browser adds the boundary).
    const headers = json
        ? authHeaders({ "Content-Type": "application/json" })
        : authHeaders();

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: formData || (json ? JSON.stringify(json) : undefined)
        });
    } catch {
        throw new Error("Unable to reach the server. Check your connection and try again.");
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        // non-JSON response, handled below
    }

    if (!response.ok || !data?.success) {
        const expired = response.status === 401 || response.status === 403;
        throw new Error(
            data?.message ||
            (expired
                ? "Your session has expired. Please log in again."
                : "Something went wrong. Please try again.")
        );
    }

    return data;
}

// Full URL for an image path like "uploads/profileImg/abc.jpg"
export function profileImageUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

// POST /profile — the password hash is dropped so it never sits in React state.
export async function getAdminProfile() {
    const data = await request("/v1/winwin/admin/auth/profile", { method: "POST" });
    const { password, ...profile } = data.data || {};
    return profile;
}

export function updateAdminProfile({ name, email, phone }) {
    return request("/v1/winwin/admin/auth/update-profile", {
        method: "PUT",
        json: { name, email, phone }
    });
}

export function updateAdminProfileImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    return request("/v1/winwin/admin/auth/update-profile-image", {
        method: "PUT",
        formData
    });
}

export function changeAdminPassword({ password, newPassword, confirmPassword }) {
    return request("/v1/winwin/admin/auth/change-password", {
        method: "PUT",
        json: { password, newPassword, confirmPassword }
    });
}