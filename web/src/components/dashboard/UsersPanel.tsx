"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  active: boolean;
};

const seed: UserRow[] = [
  { id: "u_001", name: "Alice",  email: "alice@example.com",  role: "admin",  active: true  },
  { id: "u_002", name: "Bob",    email: "bob@example.com",    role: "member", active: true  },
  { id: "u_003", name: "Carol",  email: "carol@example.com",  role: "viewer", active: false },
];

export default function UsersPanel() {
  const [rows, setRows] = useState<UserRow[]>(seed);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r => r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s));
  }, [rows, q]);

  function toggleActive(id: string) {
    setRows(rs => rs.map(r => (r.id === id ? { ...r, active: !r.active } : r)));
  }

  function changeRole(id: string, role: UserRow["role"]) {
    setRows(rs => rs.map(r => (r.id === id ? { ...r, role } : r)));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name/email..."
            className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
          />
          <button
            className="px-3 py-2 text-sm rounded-lg border"
            onClick={() => alert("Hook this to /api/users/new")}
          >
            New User
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800/60">
            <tr className="[&>th]:text-left [&>th]:px-3 [&>th]:py-2 text-neutral-500">
              <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th className="text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">
                  <select
                    className="border rounded px-2 py-1 bg-white/90 dark:bg-neutral-900"
                    value={r.role}
                    onChange={(e) => changeRole(r.id, e.target.value as UserRow["role"])}
                  >
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                    <option value="viewer">viewer</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs",
                    r.active ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100"
                  )}>
                    {r.active ? "active" : "disabled"}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <button className="text-xs underline mr-3" onClick={() => toggleActive(r.id)}>
                    {r.active ? "Disable" : "Enable"}
                  </button>
                  <button className="text-xs underline" onClick={() => alert(`Edit ${r.name}`)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td className="px-3 py-6 text-center text-neutral-500" colSpan={5}>No results</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
