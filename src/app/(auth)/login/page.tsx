// app/login/page.tsx
'use client';

import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen"> {/* Keep centering classes if needed, or rely on body flex */}
      <AuthForm type="login" />
    </div>
  );
}