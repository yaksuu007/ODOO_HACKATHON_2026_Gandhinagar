const API_BASE_URL = "http://localhost:3001/api";

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set default content type to JSON if body is present and not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  console.log(`API Request: ${API_BASE_URL}${path}`, { 
    token: token ? `${token.substring(0, 20)}...` : 'missing', 
    method: options.method || 'GET' 
  });

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  console.log(`API Response: ${path}`, { status: response.status, ok: response.ok });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('401 Unauthorized - clearing token and redirecting');
      removeAuthToken();
      if (typeof window !== "undefined" && window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.href = "/login";
      }
    }
    const errData = await response.json().catch(() => ({}));
    console.error("API Error:", response.status, response.statusText, errData);
    throw new Error(errData.error?.message || errData.detail || "API request failed");
  }

  return response.json();
}
