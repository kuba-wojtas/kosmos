import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Rejestracja</h1>
      <p className="mt-2 text-sm text-muted">
        Masz już konto?{" "}
        <Link href="/logowanie" className="text-brand hover:text-brand-hover">
          Zaloguj się
        </Link>
      </p>

      <div className="mt-6">
        <RegisterForm />
      </div>
    </div>
  );
}
