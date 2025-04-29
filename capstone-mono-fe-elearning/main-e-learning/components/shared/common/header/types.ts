import { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href?: string
  icon?: LucideIcon
  items?: NavSubItem[]
}

export interface NavSubItem {
  title: string
  href: string
  description: string
  icon?: LucideIcon
}

export interface HeaderProps {
  className?: string
}
