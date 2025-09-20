"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** 本地存储 Hook：读/写 JSON（类型安全） */
function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) {
        setVal(JSON.parse(raw) as T);
      }
    } catch {
      // ignore JSON parse errors
    }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // ignore
    }
  }, [key, val]);

  return [val, setVal] as const;
}

type Prefs = { darkMode: boolean; notifications: boolean; language: "zh" | "en" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

export default function SettingsPanel() {
  const [prefs, setPrefs] = useLocalStorage<Prefs>("xcontact:prefs", {
    darkMode: false,
    notifications: true,
    language: "zh",
  });

  // 用 if/else 避免 eslint 对“无效表达式”的警告
  useEffect(() => {
    const root = document.documentElement;
    if (prefs.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [prefs.darkMode]);

  const toggle = (k: keyof Prefs) =>
    setPrefs({
      ...prefs,
      [k]: typeof prefs[k] === "boolean" ? !prefs[k] : prefs[k],
    });

  const setLang = (l: Prefs["language"]) => setPrefs({ ...prefs, language: l });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Settings</h2>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 space-y-4">
        <Row label="深色模式">
          <button onClick={() => toggle("darkMode")} className="px-3 py-1 rounded-lg border text-sm">
            {prefs.darkMode ? "已开启" : "未开启"}
          </button>
        </Row>

        <Row label="通知">
          <button onClick={() => toggle("notifications")} className="px-3 py-1 rounded-lg border text-sm">
            {prefs.notifications ? "已开启" : "未开启"}
          </button>
        </Row>

        <Row label="语言">
          <div className="flex gap-2">
            <button
              onClick={() => setLang("zh")}
              className={cn(
                "px-3 py-1 rounded-lg border text-sm",
                prefs.language === "zh" && "bg-neutral-200 dark:bg-neutral-700/60"
              )}
            >
              中文
            </button>
            <button
              onClick={() => setLang("en")}
              className={cn(
                "px-3 py-1 rounded-lg border text-sm",
                prefs.language === "en" && "bg-neutral-200 dark:bg-neutral-700/60"
              )}
            >
              English
            </button>
          </div>
        </Row>
      </div>

      <div className="text-xs text-neutral-500">
        设置已自动保存在本地（localStorage）。接后端时可改为 <code>/api/settings</code> 持久化。
      </div>
    </div>
  );
}
