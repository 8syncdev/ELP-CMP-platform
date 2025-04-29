import { Button } from "@/components/ui/button"
import { MY_INFO } from "@/constants/my-info"
import { Github, Facebook, Youtube, Mail, Group } from "lucide-react"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

export function SocialLinks() {
  return (
    <nav className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href={MY_INFO.socials.github} target="_blank">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>GitHub</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href={MY_INFO.socials.facebook} target="_blank">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Facebook</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href={MY_INFO.socials.youtube} target="_blank">
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>YouTube</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`mailto:${MY_INFO.email}`}>
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Email</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link href={MY_INFO.socials.zaloGroup} target="_blank">
                <Group className="h-4 w-4" />
                <span className="sr-only">Zalo</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Nhóm Zalo</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </nav>
  )
}