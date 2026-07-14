import type { Metadata } from "next";
import { Fraunces, Inter, Hind_Siliguri, Baloo_Da_2 } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const hind = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});
const baloo = Baloo_Da_2({
  variable: "--font-baloo",
  subsets: ["bengali", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lima's Kitchen · লিমা'স রান্নাঘর — home-cooked Bengali party food, Welling",
  description:
    "Home-cooked Bengali party food made to order in Welling DA16. Biryani, noodles, curries and sweets for your gatherings. Collection only, cash on collection — we call to confirm every order.",
  openGraph: {
    title: "Lima's Kitchen · লিমা'স রান্নাঘর",
    description:
      "Home-cooked Bengali party food made to order in Welling. Order for collection; we call to confirm.",
    type: "website",
  },
  icons: {
    icon: "data:image/svg+xml," + encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='30' fill='oklch(0.6 0.16 45)'/><circle cx='32' cy='32' r='22' fill='none' stroke='oklch(0.95 0.05 90)' stroke-width='2.5' stroke-dasharray='5 4'/><circle cx='32' cy='32' r='9' fill='oklch(0.95 0.05 90)'/></svg>`,
    ),
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-lang="en"
      className={`${fraunces.variable} ${inter.variable} ${hind.variable} ${baloo.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div className="ambient" aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
