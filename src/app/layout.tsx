import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { siteConfig } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  title: {
    default: "ONZE | Tráfego Pago Estratégico",
    template: "%s | ONZE",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "tráfego pago",
    "agência de tráfego pago",
    "marketing de performance",
    "gestão de anúncios",
    "Google Ads",
    "Meta Ads",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: siteConfig.name,
    title: "ONZE | Tráfego Pago Estratégico",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "ONZE | Tráfego Pago Estratégico",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
