"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export default function ProfilePanel({ defaultName }: { defaultName: string }) {
  const [form, setForm] = useState({
    name: defaultName,
    email: "example@xcontact.top",
    bio: "这里是你的个人简介占位文本。",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const onChange = (k: keyof typeof form, v: string) => setForm((s) => ({ ...s, [k]: v }));

  async function onSave() {
    if (!form.name.trim()) return setMsg({ tone: "err", text: "姓名不能为空" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setMsg({ tone: "err", text: "邮箱格式不正确" });

    setSaving(true);
    setMsg(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setMsg({ tone: "ok", text: "已保存" });
    } catch (e: unknown) {
      const text = e instanceof Error ? e.message : String(e);
      setMsg({ tone: "err", text: text || "保存失败" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Profile</h2>

      {msg && (
        <div
          className={cn(
            "text-sm px-3 py-2 rounded border",
            msg.tone === "ok"
              ? "text-green-700 bg-green-50 border-green-200"
              : "text-red-700 bg-red-50 border-red-200"
          )}
        >
          {msg.text}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm text-neutral-500">Name</div>
          <input
            className="w-full border rounded-lg px-3 py-2 bg-white/90 dark:bg-neutral-900"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm text-neutral-500">Email</div>
          <input
            className="w-full border rounded-lg px-3 py-2 bg-white/90 dark:bg-neutral-900"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-neutral-500">Bio</div>
        <textarea
          className="w-full border rounded-lg px-3 py-2 min-h-[100px] bg-white/90 dark:bg-neutral-900"
          value={form.bio}
          onChange={(e) => onChange("bio", e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() =>
            setForm({
              name: defaultName,
              email: "example@xcontact.top",
              bio: "这里是你的个人简介占位文本。",
            })
          }
          className="px-4 py-2 rounded-lg border"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
