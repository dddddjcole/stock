"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

/* ✅ 从同名文件导入各面板 */
import DashboardPanel from "@/components/dashboard/DashboardPanel";
import ProfilePanel from "@/components/dashboard/ProfilePanel";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import LogoutPanel from "@/components/dashboard/LogoutPanel";
import UsersPanel from "@/components/dashboard/UsersPanel";
import ReportsPanel from "@/components/dashboard/ReportsPanel";
import AlertsPanel from "@/components/dashboard/AlertsPanel";

/* ---------------- 类型与小工具 ---------------- */
type TabType =
  | "dashboard"
  | "users"
  | "reports"
  | "alerts"
  | "profile"
  | "settings"
  | "logout";

type SideLink = { key: TabType; label: string; href: string; icon: React.ReactNode };

type User = {
  id?: number | string;
  email?: string;
  role?: string;
  display_name?: string;
  [k: string]: unknown; // 避免 any
};

function safeStr(s?: string | null, fallback = "") {
  return (s ?? "").toString().trim() || fallback;
}

/** 本地存储 Hook：读/写 JSON；val===undefined 时移除 */
function useLocalStorage<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setVal(JSON.parse(raw) as T);
    } catch {
      // ignore
    }
  }, [key]);
  useEffect(() => {
    try {
      if (typeof val === "undefined") window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // ignore
    }
  }, [key, val]);
  return [val, setVal] as const;
}

/* ---------------- 页面入口 ---------------- */
export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-neutral-500">Loading…</div>}>
      <SidebarDemo />
    </Suspense>
  );
}

function SidebarDemo() {
  const searchParams = useSearchParams();
  const router = useRouter();

  /** ✅ 用户对象：通过 useLocalStorage 读取 */
  const [user] = useLocalStorage<User | null>("xcontact:user", null);

  /** ✅ 用户名：优先本地 user（display_name -> email），再兜底 query/name，最后 Guest */
  const userName = useMemo(
    () => safeStr((user?.display_name as string) || (user?.email as string) || searchParams.get("name"), "Guest"),
    [searchParams, user]
  );

  /** tab 解析（白名单） */
  const tab = useMemo<TabType>(() => {
    const t = safeStr(searchParams.get("tab"), "dashboard").toLowerCase() as TabType;
    const whitelist: TabType[] = ["dashboard", "users", "reports", "alerts", "profile", "settings", "logout"];
    return whitelist.includes(t) ? t : "dashboard";
  }, [searchParams]);

  /** 侧边栏链接 */
  const links: Array<SideLink> = [
    {
      key: "dashboard",
      label: "Dashboard",
      href: "?tab=dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      key: "users",
      label: "Users",
      href: "?tab=users",
      icon: <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      key: "reports",
      label: "Reports",
      href: "?tab=reports",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 rotate-90" />,
    },
    {
      key: "alerts",
      label: "Alerts",
      href: "?tab=alerts",
      icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 rotate-180" />,
    },
    {
      key: "profile",
      label: "Profile",
      href: "?tab=profile",
      icon: <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      key: "settings",
      label: "Settings",
      href: "?tab=settings",
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      key: "logout",
      label: "Logout",
      href: "?tab=logout",
      icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const avatarUrl = useMemo(() => {
    const encoded = encodeURIComponent(userName || "User");
    return `https://ui-avatars.com/api/?name=${encoded}&background=111827&color=fff&size=64&length=2`;
  }, [userName]);

  return (
    <div
      className={cn(
        "w-screen h-dvh",
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800",
        "border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      )}
    >
      <Sidebar>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link) => {
                const active = tab === link.key;
                return (
                  <div
                    key={link.key}
                    className={active ? "bg-neutral-200/60 dark:bg-neutral-700/50 rounded-lg" : undefined}
                  >
                    <SidebarLink link={link} />
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userName,
                href: "?tab=profile",
                icon: (
                  <Image
                    src={avatarUrl}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                    unoptimized
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <RightPane
        tab={tab}
        userName={userName}
        onLogout={() => {
          localStorage.removeItem("xcontact:user");
          router.push("/sign-in");
        }}
      />
    </div>
  );
}

/* ---------------- Logo（修正拼写） ---------------- */
function Logo() {
  return (
    <Link
      href="?tab=dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        X Contact
      </motion.span>
    </Link>
  );
}

/* ---------------- 右侧内容区 ---------------- */
function RightPane({
  tab,
  userName,
  onLogout,
}: {
  tab: TabType;
  userName: string;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-1">
      <div className="p-3 md:p-8 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full min-h-full">
        {tab === "dashboard" && <DashboardPanel userName={userName} />}
        {tab === "users" && <UsersPanel />}
        {tab === "reports" && <ReportsPanel />}
        {tab === "alerts" && <AlertsPanel />}
        {tab === "profile" && <ProfilePanel defaultName={userName} />}
        {tab === "settings" && <SettingsPanel />}
        {tab === "logout" && <LogoutPanel onConfirm={onLogout} />}
      </div>
    </div>
  );
}
