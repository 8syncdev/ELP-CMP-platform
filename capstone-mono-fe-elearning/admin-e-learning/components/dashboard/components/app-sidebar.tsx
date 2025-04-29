"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
  DollarSign,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/components/nav-main"
import { NavProjects } from "@/components/dashboard/components/nav-projects"
import { NavUser } from "@/components/dashboard/components/nav-user"
import { TeamSwitcher } from "@/components/dashboard/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "8 Sync Dev Admin",
      logo: GalleryVerticalEnd,
      plan: "Founder: Tú Nguyễn",
    },
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "Encore Dev",
      url: "#",
      icon: User,
      isActive: true,
      items: [
        {
          title: "User",
          url: "/apis/user",
        },
        {
          title: "Role",
          url: "/apis/role",
        },
        {
          title: "User Role",
          url: "/apis/user-role",
        },
        {
          title: "Course",
          url: "/apis/course",
        },
        {
          title: "Lesson",
          url: "/apis/lesson",
        },
        {
          title: "Lesson Course",
          url: "/apis/lesson-course",
        },
        {
          title: "Enrollment",
          url: "/apis/enrollment",
        },
        {
          title: "Exercise",
          url: "/apis/exercise",
        },
        {
          title: "Blog",
          url: "/apis/blog",
        },
        {
          title: "Pricing",
          url: "/apis/pricing",
        },
        {
          title: "Pricing User",
          url: "/apis/pricing-user",
        },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Flows Dev",
    //       url: "#",
    //     },
    //     {
    //       title: "Agents",
    //       url: "#",
    //     },
    //     {
    //       title: "Deep Research",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "App",
    //       url: "#",
    //     },
    //     {
    //       title: "Account",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain title="Workspace" items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
