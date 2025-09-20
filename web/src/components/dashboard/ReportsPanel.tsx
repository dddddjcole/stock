"use client";

import React, { useMemo, useState } from "react";

type Report = {
  id: string;
  title: string;
  tag: string;     // e.g., "Macro", "Company", "Industry"
  createdAt: string; // ISO date
};

const seed: Report[] = [
  { id: "r_001", title: "Global Macro Weekly", tag: "Macro",    createdAt: "2025-09-10T08:00:00Z" },
  { id: "r_002", title: "Semiconductor Outlook", tag: "Industry", createdAt: "2025-09-12T06:30:00Z" },
  { id: "r_003", title: "XYZ Corp Earnings Note", tag: "Company", createdAt: "2025-09-14T03:10:00Z" },
];

export default function ReportsPanel() {
  const [rows, setRows] = useState<Report[]>(seed);
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState<Report["tag"]>("Macro");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(r => r.title.toLowerCase().includes(s) || r.tag.toLowerCase().includes(s));
  }, [rows, q]);

  function add() {
    const t = title.trim();
    if (!t) return;
    setRows(rs => [
      { id: `r_${Math.random().toString(36).slice(2,8)}`, title: t, tag, createdAt: new Date().toISOString() },
      ...rs,
    ]);
    setTitle("");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reports</h2>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title/tag..."
            className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
          />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
        <div className="grid gap-2 md:grid-cols-[1fr_160px_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Report title..."
            className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
          />
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value as Report["tag"])}
            className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
          >
            <option>Macro</option>
            <option>Industry</option>
            <option>Company</option>
            <option>Quant</option>
          </select>
          <button className="px-3 py-2 text-sm rounded-lg border" onClick={add}>Add</button>
        </div>
        <div className="text-xs text-neutral-500">建议接后端：POST /api/reports, GET /api/reports</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map(r => (
          <div key={r.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-gray-50 dark:bg-neutral-800/60">
            <div className="text-sm text-neutral-500">{new Date(r.createdAt).toLocaleString()}</div>
            <div className="text-base font-medium mt-1">{r.title}</div>
            <div className="text-xs mt-2 inline-flex px-2 py-0.5 rounded border">{r.tag}</div>
            <div className="mt-3 flex gap-2">
              <button className="text-xs underline" onClick={() => alert(`Open ${r.title}`)}>Open</button>
              <button className="text-xs underline" onClick={() => alert(`Export ${r.title}`)}>Export</button>
              <button className="text-xs underline text-red-600" onClick={() => setRows(rs => rs.filter(x => x.id !== r.id))}>Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-neutral-500">No reports</div>
        )}
      </div>
    </div>
  );
}
