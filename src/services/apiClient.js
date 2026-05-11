// Camcine - API Client
// Base URL from production server (GCP): https://camcine-api-604298774917.asia-south1.run.app/api/v1

const BASE_URL = 'https://camcine-api-604298774917.asia-south1.run.app/api/v1';

// Token storage keys
const TOKEN_KEY = 'camcine_token';
const USER_KEY = 'camcine_auth_user';

// Token helpers
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

// User storage helpers
export const userStorage = {
  get: () => {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  },
  set: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  remove: () => localStorage.removeItem(USER_KEY),
};

/**
 * Core fetch wrapper with auth header injection and error normalisation.
 * @param {string} endpoint  - path relative to BASE_URL, e.g. '/auth/login'
 * @param {RequestInit} options - standard fetch options
 * @param {boolean} authenticated - if true, attaches Bearer token
 */
export async function apiRequest(endpoint, options = {}, authenticated = false) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authenticated) {
    const token = tokenStorage.get();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    // Normalise error message from API response shape
    const message =
      data?.message ||
      (Array.isArray(data?.errors) && data.errors[0]?.message) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
