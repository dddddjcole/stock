"use client";

import React, { useEffect, useState } from "react";

type Channel = "email" | "webhook";
type Period = "realtime" | "hourly" | "daily";
type AlertRule = {
  id: string;
  name: string;
  metric: string; // e.g., "conversion_rate", "error_rate"
  operator: ">" | "<" | ">=" | "<=";
  threshold: number;
  period: Period;
  channel: Channel;
  target: string; // email address or webhook URL
  enabled: boolean;
};

const LS_KEY = "xcontact:alerts";

export default function AlertsPanel() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [form, setForm] = useState<AlertRule>({
    id: "",
    name: "",
    metric: "conversion_rate",
    operator: ">=",
    threshold: 3.0,
    period: "daily",
    channel: "email",
    target: "you@example.com",
    enabled: true,
  });

  // localStorage 持久化（示例）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          // 仅接受对象数组；更严格可逐项校验
          setRules(parsed as AlertRule[]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(rules));
    } catch {
      // ignore
    }
  }, [rules]);

  // ✅ 类型安全的 onChange：根据键推导值的类型
  function onChange<K extends keyof AlertRule>(k: K, v: AlertRule[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function addRule() {
    if (!form.name.trim()) return alert("Rule name is required");
    if (!form.target.trim()) return alert("Target is required");
    const rule: AlertRule = { ...form, id: `a_${Math.random().toString(36).slice(2, 8)}` };
    setRules((rs) => [rule, ...rs]);
    setForm({ ...form, name: "" });
  }

  function toggleRule(id: string) {
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }

  function removeRule(id: string) {
    setRules((rs) => rs.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Alerts</h2>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <div className="text-sm text-neutral-500">Rule name</div>
            <input
              className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="e.g. CR ≥ 3% Daily"
            />
          </div>

          <div className="space-y-1">
            <div className="text-sm text-neutral-500">Metric</div>
            <select
              className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
              value={form.metric}
              onChange={(e) => onChange("metric", e.target.value)}
            >
              <option value="conversion_rate">conversion_rate</option>
              <option value="error_rate">error_rate</option>
              <option value="active_users">active_users</option>
              <option value="messages">messages</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-neutral-500">Condition</div>
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-2 text-sm bg-white/90 dark:bg-neutral-900"
                value={form.operator}
                onChange={(e) => onChange("operator", e.target.value as AlertRule["operator"])}
              >
                <option>&gt;</option>
                <option>&lt;</option>
                <option>&gt;=</option>
                <option>&lt;=</option>
              </select>
              <input
                type="number"
                step="0.01"
                className="border rounded px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
                value={form.threshold}
                onChange={(e) => onChange("threshold", Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <div className="text-sm text-neutral-500">Period</div>
            <select
              className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
              value={form.period}
              onChange={(e) => onChange("period", e.target.value as AlertRule["period"])}
            >
              <option value="realtime">realtime</option>
              <option value="hourly">hourly</option>
              <option value="daily">daily</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-neutral-500">Channel</div>
            <select
              className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
              value={form.channel}
              onChange={(e) => onChange("channel", e.target.value as AlertRule["channel"])}
            >
              <option value="email">email</option>
              <option value="webhook">webhook</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-neutral-500">{form.channel === "email" ? "Email" : "Webhook URL"}</div>
            <input
              className="border rounded-lg px-3 py-2 text-sm bg-white/90 dark:bg-neutral-900"
              value={form.target}
              onChange={(e) => onChange("target", e.target.value)}
              placeholder={form.channel === "email" ? "you@example.com" : "https://..."}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-3 py-2 text-sm rounded-lg border" onClick={addRule}>
            Add Rule
          </button>
        </div>

        <div className="text-xs text-neutral-500">
          后端建议：保存规则到 <code>/api/alerts</code>；用 cron/worker 定时拉取指标，命中则发邮件或推送 Webhook。
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-800/60">
            <tr className="[&>th]:text-left [&>th]:px-3 [&>th]:py-2 text-neutral-500">
              <th>Name</th>
              <th>Metric</th>
              <th>Condition</th>
              <th>Period</th>
              <th>Channel</th>
              <th>Target</th>
              <th>Status</th>
              <th className="text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.metric}</td>
                <td className="px-3 py-2">
                  {r.operator} {r.threshold}
                </td>
                <td className="px-3 py-2">{r.period}</td>
                <td className="px-3 py-2">{r.channel}</td>
                <td className="px-3 py-2">{r.target}</td>
                <td className="px-3 py-2">{r.enabled ? "enabled" : "disabled"}</td>
                <td className="px-3 py-2 text-right">
                  <button className="text-xs underline mr-3" onClick={() => toggleRule(r.id)}>
                    {r.enabled ? "Disable" : "Enable"}
                  </button>
                  <button className="text-xs underline text-red-600" onClick={() => removeRule(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-neutral-500" colSpan={8}>
                  No rules
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
