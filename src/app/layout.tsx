import type { Metadata } from "next";
import { switzer, cabinetGrotesk } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kosmos - zgłoszenia",
  description: "System obsługi zgłoszeń dla pracowników szkoły.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${switzer.variable} ${cabinetGrotesk.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
