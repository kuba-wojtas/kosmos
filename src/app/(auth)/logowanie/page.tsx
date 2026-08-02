import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Logowanie</h1>
      <p className="mt-2 text-sm text-muted">
        Nie masz konta?{" "}
        <Link href="/rejestracja" className="text-brand hover:text-brand-hover">
          Zarejestruj się
        </Link>
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>

      <div className="mt-6 rounded-lg border border-line bg-raised px-4 py-3 text-xs text-muted">
        <p className="font-semibold text-fg">Konta demo</p>
        <p className="mt-1">admin@kosmos.pl / demo1234</p>
        <p>user@kosmos.pl / demo1234</p>
      </div>
    </div>
  );
}
