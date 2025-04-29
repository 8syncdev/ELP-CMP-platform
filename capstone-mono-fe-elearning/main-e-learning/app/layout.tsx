import localFont from "next/font/local";
import "./globals.css";
import "./styles/utilities.css";
import "./styles/chat-ai.css";
import { Toaster } from "@/components/ui/toaster";
import { CMPProvider } from '@/providers/cmp-context';
import { ChatPopup } from '@/components/shared/dev';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary-dev`}
      >
        <CMPProvider>
          {children}
          <ChatPopup />
        </CMPProvider>
        <Toaster />
      </body>
    </html>
  )
}
