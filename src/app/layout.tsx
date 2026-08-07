import type { Metadata } from "next";
import { Marcellus, Rambla } from "next/font/google";
import { JsonLd } from "../../components/JsonLd";
import { createOrganizationSchema } from "../../lib/seo/schema";
import { siteConfig } from "../../site.config";
import "./globals.css";

const marcellus = Marcellus({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const rambla = Rambla({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-rambla",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Масаж в Одесі | Body Restore",
    template: "%s | Body Restore",
  },
  description: siteConfig.defaultDescription,
  alternates: { canonical: "/" },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${marcellus.variable} ${rambla.variable}`}>
      <body className="min-h-screen overflow-hidden bg-background text-foreground antialiased">
        <JsonLd data={createOrganizationSchema()} />
        {children}
      </body>
    </html>
  );
}
