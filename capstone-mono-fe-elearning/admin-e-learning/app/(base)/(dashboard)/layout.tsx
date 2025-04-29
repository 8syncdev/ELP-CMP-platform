import { AppSidebar, BreadcrumbUI } from "@/components/dashboard/components"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getUserInfo } from "@/lib/actions/auth"
import { checkRoleAdmin } from "@/lib/actions/role"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // const getInfoUser = await getUserInfo();
    // if (!getInfoUser.success) {
    //     redirect("/login");
    // }
    const checkAdmin = await checkRoleAdmin();
    if (!checkAdmin.success) {
        redirect("/login");
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <BreadcrumbUI />
                </header>
                <main className="w-full p-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
