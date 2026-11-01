import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "JASS Longevity Studio",
  description: "Evidence-informed healthy ageing and personal wellbeing workspace.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
