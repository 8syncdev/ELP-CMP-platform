import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SecurityProvider from "@/providers/security-provider";
import { MY_INFO } from "@/constants/my-info";
import { Toaster } from "sonner";
import BreadcrumbDev from "@/providers/breadcrumb-dev";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: MY_INFO.company,
  description: MY_INFO.description,
  icons: [
    {
      url: MY_INFO.logo,
      sizes: "any",
      type: "image",
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BreadcrumbDev notShow={["test"]} />
        <SecurityProvider onSecurity="true">
          {children}
        </SecurityProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
