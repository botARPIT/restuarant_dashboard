export const API_BASE = (import.meta.env.VITE_API_BASE_URL || http://localhost:5000/api) as string;

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers: { Content-Type: application/json, ...(init?.headers||{}) } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json();
}

export async function sendJSON<T>(path: string, method: string, body?: unknown): Promise<T> {
  return getJSON<T>(path, { method, body: body ? JSON.stringify(body) : undefined });
}
