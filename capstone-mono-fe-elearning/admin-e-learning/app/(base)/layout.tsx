import type { Metadata } from "next";
import { MY_INFO } from "@/constants/my-info";
import { AuthProvider, SecurityProvider, ThemeProvider } from "@/providers";
import { getUserInfo } from "@/lib/actions/auth";


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

export default async function BaseLayout({
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
                <SecurityProvider onSecurity="false">
                    {children}
                </SecurityProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
