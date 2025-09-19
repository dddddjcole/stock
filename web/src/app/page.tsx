// src/app/page.tsx
import { SignIn } from '@/components/ui/sign-in';

export default function Home() {
  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <SignIn />
    </div>
  );
}

