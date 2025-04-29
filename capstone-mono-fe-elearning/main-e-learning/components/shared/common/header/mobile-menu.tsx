import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { navigationConfig } from "./config"
import Link from "next/link"
import { SocialLinks } from "./social-links"
import { MY_INFO } from "@/constants/my-info"
import { useAuth } from "@/providers/auth-context"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"

export function MobileMenu() {
  const { user, isLoading, logout } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-4 py-4">
          {/* User Profile Section */}
          <div className="px-6 py-2">
            {isLoading ? (
              <div className="h-12 w-full rounded-lg bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {user.full_name?.[0] || user.username[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user.full_name || user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => logout()}
                  >
                    Đăng xuất
                  </Button>
                  <Button
                    className="flex-1"
                    asChild
                  >
                    <Link href={MY_INFO.socials.zalo} target="_blank">
                      Kết nối ngay
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  asChild
                >
                  <Link href="/login">
                    Đăng nhập
                  </Link>
                </Button>
                <Button
                  className="flex-1"
                  asChild
                >
                  <Link href={MY_INFO.socials.zalo} target="_blank">
                    Kết nối ngay
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-2" />

          {/* Theme Toggle */}
          <div className="px-6 py-2">
            <h3 className="mb-2 text-sm font-semibold">Giao diện</h3>
            <ThemeToggle />
          </div>

          {/* Navigation Menu */}
          <div className="px-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {MY_INFO.company}
            </h2>
            <div className="space-y-1">
              {navigationConfig.mainNav.map((item) => (
                <div key={item.title}>
                  {item.items ? (
                    <>
                      <h3 className="mb-2 px-4 text-sm font-semibold">
                        {item.icon && <item.icon className="mr-2 h-4 w-4 inline" />}
                        {item.title}
                      </h3>
                      <div className="space-y-1">
                        {item.items.map((subItem) => (
                          <Button
                            key={subItem.title}
                            asChild
                            variant="ghost"
                            className="w-full justify-start px-4"
                          >
                            <Link href={subItem.href}>
                              {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                              <span>{subItem.title}</span>
                            </Link>
                          </Button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Link href={item.href}>
                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                        {item.title}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-2" />

          {/* Social Links */}
          <div className="px-6 py-2">
            <h3 className="mb-2 text-sm font-semibold">Kết nối</h3>
            <SocialLinks />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 