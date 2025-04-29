import { cn } from "@/lib/utils"
import { NavItem } from "./types"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

interface NavMenuProps {
  items: NavItem[]
}

export function NavMenu({ items }: NavMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.items ? (
              <>
                <NavigationMenuTrigger className="h-9 bg-background/95 hover:bg-accent/80">
                  {item.icon && (
                    <item.icon className="mr-2 h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium text-sm">{item.title}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[25rem] gap-3 p-4 md:w-[31.25rem] md:grid-cols-2">
                    {item.items.map((subItem) => (
                      <li key={subItem.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3",
                              "no-underline outline-none transition-colors duration-200",
                              "hover:bg-accent/90 hover:text-accent-foreground",
                              "focus:bg-accent/90 focus:text-accent-foreground",
                              "border border-transparent hover:border-primary/20"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4 text-primary" />
                              )}
                              <div className="text-sm font-semibold leading-none">
                                {subItem.title}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground mt-2">
                              {subItem.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={item.href!}
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center",
                    "rounded-md bg-background/95 px-4 py-2 text-sm font-medium",
                    "transition-colors duration-200",
                    "hover:bg-accent/80 hover:text-accent-foreground",
                    "focus:bg-accent/80 focus:text-accent-foreground",
                    "border border-transparent hover:border-primary/20"
                  )}
                >
                  {item.icon && (
                    <item.icon className="mr-2 h-4 w-4 text-primary" />
                  )}
                  {item.title}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}