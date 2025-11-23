const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request(path: string, opts?: RequestInit) {
  const response = await fetch(API_BASE + path, { ...opts });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw { status: response.status, data };
  return data;
}

export const api = {
  create: (payload: { target_url: string; custom_code?: string }) =>
    request("/api/links/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  list: (q?: string) =>
    request("/api/links" + (q ? `?q=${encodeURIComponent(q)}` : "")),
  delete: (id: number) => request(`/api/links/${id}`, { method: "DELETE" }),
  stats: (code: string) =>
    request(`/api/links/code/${encodeURIComponent(code)}`),
  health: () => request("/health"),
};
