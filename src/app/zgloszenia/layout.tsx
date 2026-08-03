import { requireSession } from "@/lib/session";
import { Topbar } from "@/components/Topbar";

export default async function ZgloszeniaLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();

  return (
    <>
      <Topbar user={user} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
