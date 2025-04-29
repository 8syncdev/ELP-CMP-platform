import * as React from "react"
import { Home, Layers, Settings, MessageSquare, Plus, Sparkles, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavUser } from "./nav-user"
import { NavSecondary } from "./nav-secondary"
import { SearchForm } from "./search-form"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Define interfaces for the data structure
interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AdSection {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  icon?: LucideIcon;
  gradient?: string;
}

interface SidebarProps extends React.ComponentProps<typeof Sidebar> {
  versions?: string[];
  defaultVersion?: string;
  navigation?: NavGroup[];
  secondaryNavigation?: NavItem[];
  showSearch?: boolean;
  showVersionSwitcher?: boolean;
  showAds?: boolean;
  adSections?: AdSection[];
  appName?: string;
  user?: {
      name: string;
      email: string;
      avatar: string;
  };
  children?: React.ReactNode;
}

const defaultAdSection: AdSection = {
    title: "Nâng cấp Pro",
    description: "Trải nghiệm tính năng cao cấp với phiên bản Pro",
    buttonText: "Nâng cấp ngay",
    buttonUrl: "/upgrade",
    icon: Sparkles,
    gradient: "from-indigo-500 to-purple-500"
};

export function AppSidebar({
    versions,
    defaultVersion,
    navigation = [],
    secondaryNavigation = [],
    showSearch = false,
    showVersionSwitcher = false,
    showAds = true,
    adSections = [],
    appName = "AI Agent",
    user,
    children,
    ...props
}: SidebarProps) {
    const allAdSections = adSections.length > 0 ? adSections : [defaultAdSection];

    return (
        <Sidebar {...props} className="flex flex-col h-screen">
            <SidebarHeader className="flex pt-20 items-center border-b px-4">
                <span className="font-semibold">{appName}</span>
            </SidebarHeader>

            <div className="flex-1 flex flex-col min-h-0">
                {/* Chat History from children */}
                <div className="h-[60%] min-h-0 border-b">
                    <ScrollArea className="h-full">
                        <SidebarContent>
                            {children}
                        </SidebarContent>
                    </ScrollArea>
                </div>

                {/* Secondary Navigation and Ads */}
                <div className="h-[40%] min-h-0">
                    <ScrollArea className="h-full">
                        <SidebarContent>
                            {/* Secondary Navigation */}
                            {secondaryNavigation.length > 0 && (
                                <NavSecondary items={secondaryNavigation} />
                            )}

                            {/* Ads Sections */}
                            {showAds && allAdSections.map((section, index) => (
                                <SidebarGroup key={index}>
                                    <Card className="mx-2 my-4 overflow-hidden">
                                        <div className={cn(
                                            "bg-gradient-to-r p-4 text-white",
                                            section.gradient || defaultAdSection.gradient
                                        )}>
                                            <div className="flex items-center gap-2">
                                                {section.icon && React.createElement(section.icon, {
                                                    className: "h-5 w-5"
                                                })}
                                                <h3 className="font-semibold">{section.title}</h3>
                                            </div>
                                            <p className="mt-2 text-sm">
                                                {section.description}
                                            </p>
                                            <Button 
                                                variant="secondary" 
                                                className="mt-3 w-full"
                                                asChild
                                            >
                                                <a href={section.buttonUrl}>
                                                    {section.buttonText}
                                                </a>
                                            </Button>
                                        </div>
                                    </Card>
                                </SidebarGroup>
                            ))}

                            {/* Main Navigation */}
                            {navigation.map((group) => (
                                <SidebarGroup key={group.title}>
                                    <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {group.items.map((item) => (
                                                <SidebarMenuItem key={item.title}>
                                                    <SidebarMenuButton 
                                                        asChild 
                                                        isActive={item.isActive}
                                                    >
                                                        <a href={item.url}>
                                                            {item.icon && React.createElement(item.icon, {
                                                                className: "h-4 w-4"
                                                            })}
                                                            {item.title}
                                                        </a>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            ))}
                        </SidebarContent>
                    </ScrollArea>
                </div>
            </div>

            <SidebarFooter className="flex-none border-t">
                {user && <NavUser user={user} />}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
