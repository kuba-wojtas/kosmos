export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8">
        {children}
      </div>
    </div>
  );
}
