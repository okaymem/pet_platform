const API_URL = import.meta.env.VITE_API_URL ?? "";

let sessionToken: string | null = null;

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}

export function setSessionToken(token: string) {
  sessionToken = token;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
) {
  const headers = new Headers(options.headers);

  if (sessionToken) {
    headers.set("Authorization", `Bearer ${sessionToken}`);
  }
console.log("AUTH TOKEN:", sessionToken ? "PRESENT" : "MISSING");
  return fetch(apiUrl(path), {
    ...options,
    headers,
  });
}