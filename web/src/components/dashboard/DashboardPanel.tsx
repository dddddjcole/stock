"use client";
import React from "react";

function KPI({ title, value, desc }: { title: string; value: string; desc?: string }) {
  return (
    <div className="h-full w-full rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-gray-50 dark:bg-neutral-800/60">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {desc && <div className="text-xs text-neutral-500 mt-1">{desc}</div>}
    </div>
  );
}

export default function DashboardPanel({ userName }: { userName: string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">欢迎回来，{userName}</h2>
        <div className="text-xs text-neutral-500">今天 {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
        <KPI title="今日活跃" value="1,284" desc="+12% vs 昨日" />
        <KPI title="转化率" value="3.7%" desc="+0.4pp" />
        <KPI title="消息量" value="9,412" desc="近24小时" />
        <KPI title="错误率" value="0.21%" desc="-0.03pp" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="text-sm font-medium">最近动态</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>导入客户数据</span><span className="text-neutral-500">10:21</span></li>
            <li className="flex justify-between"><span>配置 Webhook</span><span className="text-neutral-500">09:44</span></li>
            <li className="flex justify-between"><span>修复提示词模板</span><span className="text-neutral-500">09:12</span></li>
          </ul>
        </div>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="text-sm font-medium">待办事项</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>· 完成用户分群配置</li>
            <li>· 接入邮件通知（cron）</li>
            <li>· 编写导出报表脚本</li>
          </ul>
        </div>
      </div>
    </>
  );
}
