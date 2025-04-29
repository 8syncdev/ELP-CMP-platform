import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { MY_INFO } from "@/constants/my-info";
import SecurityProvider from "@/providers/security-provider";
import { BreadcrumbDev } from "@/components/shared/common"
import { Header } from "@/components/shared/common"
import { Footer } from "@/components/shared/common/footer"
import { AuthProvider } from "@/providers";


export const metadata: Metadata = {
  title: MY_INFO.company,
  description: MY_INFO.description,
  icons: [
    {
      url: MY_INFO.logo.src,
      sizes: "any",
      type: "image",
    }
  ]
};

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <SecurityProvider onSecurity="true">
          <Header />
          <BreadcrumbDev
            className="px-4 py-2 rounded-md shadow-sm sticky top-0 z-50 drop-shadow-sm backdrop-blur-sm"
            notShow={[
              "/test",
              "/ai-agent",
              "/test/game-3d",
              "/test/chat-trial",
              "/test/chat-premium",
              "/learning"
            ]}
          />
          <main className={""}>
            <div className="flex flex-col min-h-screen h-auto">
              {children}
            </div>
          </main>
          <Footer
            notShow={[
              "/test",
              "/test/game-3d",
              "/test/chat-trial",
              "/test/chat-premium",
              "/learning"
            ]}
          />
        </SecurityProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
