"use client";
import React from "react";

export default function LogoutPanel({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Logout</h2>
      <p className="text-sm text-neutral-500">当前为示例登出。接入后端后可调用 /logout 清理会话。</p>
      <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black">
        确认退出
      </button>
    </div>
  );
}
