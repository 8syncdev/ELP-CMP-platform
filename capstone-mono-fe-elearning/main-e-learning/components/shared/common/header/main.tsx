"use client"

import Link from "next/link"
import { MY_INFO } from "@/constants/my-info"
import { Button } from "@/components/ui/button"
import { NavMenu } from "./nav-menu"
import { SocialLinks } from "./social-links"
import { MobileMenu } from "./mobile-menu"
import { Logo } from "../logo/main"
import { cn } from "@/lib/utils"
import { navigationConfig } from "./config"
import { HeaderProps } from "./types"
import { UserAvatar } from "@/components/shared/dev/avatar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "./theme-toggle"

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between mx-auto">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileMenu />
        </div>

        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="hidden font-bold sm:inline-block font-mono italic animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              8SyncDev
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavMenu items={navigationConfig.mainNav} />

          <div className="flex items-center gap-4">
            <Separator orientation="vertical" className="h-6" />

            <div className="hidden md:flex">
              <SocialLinks />
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Avatar */}
            <UserAvatar />

            <Button
              className="font-medium hidden lg:flex"
              size="sm"
              variant="default"
            >
              <Link href={MY_INFO.socials.zalo} target="_blank">
                Kết nối ngay
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}