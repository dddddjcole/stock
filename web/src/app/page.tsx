"use client";

import React, { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginByEmail } from "@/lib/api";
import "./auth.css";

/** ----------------- Helper: Google Icon ----------------- */
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

/** ----------------- Types ----------------- */
export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignLayoutProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  /** 左侧面板（登录/注册） */
  left: React.ReactNode;
}

type Tone = "neutral" | "success" | "error" | "warning";

/** ----------------- Mock 数据 ----------------- */
const sampleTestimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Sarah Chen",
    handle: "@sarahdigital",
    text: "Amazing platform! The user experience is seamless and the features are exactly what I needed."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/64.jpg",
    name: "Marcus Johnson",
    handle: "@marcustech",
    text: "This service has transformed how I work. Clean design, powerful features, and excellent support."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "David Martinez",
    handle: "@davidcreates",
    text: "I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity."
  },
];

/** ----------------- 小组件 ----------------- */
const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ t, delay }: { t: Testimonial; delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={t.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt={`${t.name} avatar`} />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{t.name}</p>
      <p className="text-muted-foreground">{t.handle}</p>
      <p className="mt-1 text-foreground/80">{t.text}</p>
    </div>
  </div>
);

/** ----------------- 固定宽度消息条（按基准句长度计算） ----------------- */
function MessageBar({
  text,
  tone = "neutral",
}: {
  text?: string;
  tone?: "neutral" | "success" | "error" | "warning";
}) {
  // 基准句（用于决定固定宽度）
  const BASE_TEXT =
    "Access your account and continue your journey with us";
  const BASE_LEN = BASE_TEXT.length; // 53 个字符

  // 颜色
  const toneCls =
    tone === "success" ? "text-green-600"
    : tone === "error" ? "text-red-600"
    : tone === "warning" ? "text-amber-600"
    : "text-muted-foreground";

  // 用“数字等宽空格” U+2007 作为占位符（看不见但占宽度比较稳定）
  const FIGURE_SPACE = "\u2007";
  const padCount = Math.max(0, BASE_LEN - (text?.length ?? 0));
  const padTail = padCount > 0 ? FIGURE_SPACE.repeat(padCount) : "";

  return (
    // 固定宽度：以 ch 为单位，等于基准句字符数；固定高度避免竖向抖动
    <div
      className="h-6 md:h-7 w-full"
      style={{ width: `${BASE_LEN}ch` }}
    >
      <p
        className={[
          "animate-element animate-delay-200 text-sm leading-6 md:leading-7 whitespace-nowrap overflow-hidden text-ellipsis",
          text ? toneCls : "opacity-0",
        ].join(" ")}
        // 悬停展示完整内容
        title={text || ""}
        aria-live="polite"
      >
        {(text || "") + padTail}
      </p>
    </div>
  );
}

/** ----------------- 右侧面板（保持不刷新） ----------------- */
const RightPane = React.memo(function RightPane({
  heroImageSrc,
  testimonials,
}: {
  heroImageSrc?: string;
  testimonials?: Testimonial[];
}) {
  if (!heroImageSrc) return null;
  return (
    <section className="hidden md:block flex-1 relative p-4">
      <div
        className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImageSrc})` }}
        aria-label="Hero image"
      />
      {testimonials && testimonials.length > 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
          <TestimonialCard t={testimonials[0]} delay="animate-delay-1000" />
          {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard t={testimonials[1]} delay="animate-delay-1200" /></div>}
          {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard t={testimonials[2]} delay="animate-delay-1400" /></div>}
        </div>
      )}
    </section>
  );
});

/** ----------------- 登录表单 ----------------- */
function SignInForm({
  onSwitchToRegister,
  status,
  onFeedback,
}: {
  onSwitchToRegister: () => void;
  status: { text?: string; tone?: Tone };
  onFeedback: (f: { text?: string; tone?: Tone }) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return onFeedback({ text: "请输入有效的邮箱地址", tone: "error" });
    if (!password) return onFeedback({ text: "请输入密码", tone: "error" });

    try {
      const { ok } = await loginByEmail(email, password);
      if (ok) {
        onFeedback({ text: "登录成功，正在跳转到 Dashboard …", tone: "success" });
        router.push("/dashboard");
      } else {
        onFeedback({ text: "登录失败，请稍后重试", tone: "error" });
      }
    } catch (err: any) {
      const msg = String(err?.message || "登录失败");
      if (/不存在|未注册|not\s*found|does\s*not\s*exist/i.test(msg)) {
        onFeedback({ text: "账号不存在，点击下方 Create Account 立即注册。", tone: "warning" });
      } else if (/密码|password/i.test(msg)) {
        onFeedback({ text: "密码错误，请重试或重置密码。", tone: "error" });
      } else if (/停用|inactive|disabled/i.test(msg)) {
        onFeedback({ text: "账户已被停用，请联系管理员。", tone: "warning" });
      } else {
        onFeedback({ text: msg || "登录失败，请稍后重试", tone: "error" });
      }
    }
  };

  const handleGoogleSignIn = () => {
    onFeedback({ text: "Google 登录暂未开通", tone: "warning" });
  };

  const handleResetPassword = () => {
    onFeedback({ text: "请联系管理员或稍后在“忘记密码”中完成重置。", tone: "neutral" });
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-6">
        <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
          <span className="font-light text-foreground tracking-tighter">Welcome</span>
        </h1>

        <MessageBar text={status.text} tone={status.tone} />

        <form className="space-y-5" onSubmit={handleSignIn}>
          <div className="animate-element animate-delay-300">
            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
            <GlassInputWrapper>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                required
              />
            </GlassInputWrapper>
          </div>

          <div className="animate-element animate-delay-400">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <GlassInputWrapper>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  )}
                </button>
              </div>
            </GlassInputWrapper>
          </div>

          <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="rememberMe" className="custom-checkbox" />
              <span className="text-foreground/90">Keep me signed in</span>
            </label>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleResetPassword(); }}
              className="hover:underline text-violet-400 transition-colors"
            >
              Reset password
            </a>
          </div>

          <button
            type="submit"
            className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="animate-element animate-delay-700 relative flex items-center justify-center">
          <span className="w-full border-t border-border"></span>
          <span className="px-4 text-sm text-muted-foreground bg-background absolute">Or continue with</span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
          New to our platform?{" "}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}
            className="text-violet-400 hover:underline transition-colors"
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}

/** ----------------- 注册表单（样式与登录一致） ----------------- */
function RegisterForm({
  onSwitchToSignIn,
  status,
  onFeedback,
}: {
  onSwitchToSignIn: () => void;
  status: { text?: string; tone?: Tone };
  onFeedback: (f: { text?: string; tone?: Tone }) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirmPassword") || "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return onFeedback({ text: "请输入有效的邮箱地址", tone: "error" });
    }
    if (password.length < 6) {
      return onFeedback({ text: "密码至少 6 位", tone: "error" });
    }
    if (password !== confirm) {
      return onFeedback({ text: "两次输入的密码不一致", tone: "error" });
    }

    // TODO: 接后端 /api/auth/register
    onFeedback({ text: "注册接口尚未接通，提交成功后将跳转到登录页。", tone: "warning" });
  };

  const handleGoogle = () => {
    onFeedback({ text: "Google 注册暂未开通", tone: "warning" });
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-6">
        <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">
          <span className="font-light text-foreground tracking-tighter">Create Account</span>
        </h1>
        <MessageBar text={status.text} tone={status.tone} />

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="animate-element animate-delay-250">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <GlassInputWrapper>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                required
              />
            </GlassInputWrapper>
          </div>

          <div className="animate-element animate-delay-300">
            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
            <GlassInputWrapper>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                required
              />
            </GlassInputWrapper>
          </div>

          <div className="animate-element animate-delay-400">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <GlassInputWrapper>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  )}
                </button>
              </div>
            </GlassInputWrapper>
          </div>

          <div className="animate-element animate-delay-450">
            <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
            <GlassInputWrapper>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  )}
                </button>
              </div>
            </GlassInputWrapper>
          </div>

          <div className="animate-element animate-delay-500 text-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="agree" className="custom-checkbox" required />
              <span className="text-foreground/90">
                I agree to the <a className="text-violet-400 hover:underline" href="#">Terms</a> and{" "}
                <a className="text-violet-400 hover:underline" href="#">Privacy Policy</a>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="animate-element animate-delay-700 relative flex items-center justify-center">
          <span className="w-full border-t border-border"></span>
          <span className="px-4 text-sm text-muted-foreground bg-background absolute">Or continue with</span>
        </div>

        <button
          onClick={handleGoogle}
          className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToSignIn();
              onFeedback({ text: "Access your account and continue your journey with us", tone: "neutral" });
            }}
            className="text-violet-400 hover:underline transition-colors"
          >
            Back to Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

/** ----------------- 两栏布局（左：表单，可切换；右：不受影响） ----------------- */
function SignLayout({ title, description, heroImageSrc, testimonials, left }: SignLayoutProps) {
  return (
    <div className="bg-background text-foreground h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      <section className="flex-1 flex items-center justify-center p-8">{left}</section>
      <RightPane heroImageSrc={heroImageSrc} testimonials={testimonials} />
    </div>
  );
}

/** ----------------- 页面组件（切换逻辑） ----------------- */
export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [leftKey, setLeftKey] = useState(0);

  const [feedback, setFeedback] = useState<{ text?: string; tone?: Tone }>({
    text: "Access your account and continue your journey with us",
    tone: "neutral",
  });

  const hero = "https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80";
  const tms = sampleTestimonials;

  const leftNode = useMemo(() => {
    if (mode === "signin") {
      return (
        <SignInForm
          status={feedback}
          onFeedback={setFeedback}
          onSwitchToRegister={() => {
            setMode("register");
            setLeftKey((k) => k + 1);
            setFeedback({ text: "Join us and start your journey today", tone: "neutral" });
          }}
        />
      );
    }
    return (
      <RegisterForm
        status={feedback}
        onFeedback={setFeedback}
        onSwitchToSignIn={() => {
          setMode("signin");
          setLeftKey((k) => k + 1);
          setFeedback({ text: "Access your account and continue your journey with us", tone: "neutral" });
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, feedback]);

  return (
    <SignLayout
      title={<span className="font-light text-foreground tracking-tighter">Welcome</span>}
      description={mode === "signin" ? "Access your account and continue your journey with us" : "Join us and start your journey today"}
      heroImageSrc={hero}
      testimonials={tms}
      left={<div key={leftKey}>{leftNode}</div>}
    />
  );
}
