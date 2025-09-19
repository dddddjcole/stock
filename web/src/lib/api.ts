// src/lib/api.ts
export const API_BASE = "http://8.136.0.86:8000";

export async function loginByEmail(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 很关键：让浏览器带上/接收 HttpOnly Cookie
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    // FastAPI 可能返回 {detail: "..."} 或纯文本
    let msg = "登录失败";
    try {
      const data = await res.json();
      msg = (data?.detail as string) || msg;
    } catch {
      msg = await res.text();
    }
    throw new Error(msg || "登录失败");
  }

  return res.json(); // { ok: true, user: {...} }
}

/** 邮箱注册 */
export async function registerByEmail(email: string, password: string, displayName?: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      display_name: displayName || "",
    }),
    // 如果你用 Cookie 跨站，这里视情况加上：
    // credentials: "include",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // 409：已存在；422：参数问题；其它：通用
    const msg = json?.detail || json?.message || `注册失败 (${res.status})`;
    throw new Error(msg);
  }
  return json as { ok: boolean };
}