"use client"
import { Separator } from "@/components/ui/separator";
import { FooterBrand } from "./footer-brand";
import { FooterLinks } from "./footer-links";
import { FooterSocials } from "./footer-socials";
import { FooterContact } from "./footer-contact";
import { MY_INFO } from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface FooterProps {
    className?: string;
    notShow?: string[];
}

const checkPathInclude = (path: string, notShow: string[]) => {
    return notShow.some(item => path.includes(item))
}

export function Footer({
    className,
    notShow = ["/test", "/test/game-3d"]
}: FooterProps) {
    const pathname = usePathname();
    if (checkPathInclude(pathname, notShow)) return null;
    return (
        <footer className={cn("border-t bg-background", className)}>
            <div className="container px-4 py-8 md:py-12 mx-auto">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <FooterBrand />
                    <FooterLinks />
                    <div className="space-y-6">
                        <FooterSocials />
                        <Separator />
                        <FooterContact />
                    </div>
                </div>
                <Separator className="my-8" />
                <div className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {MY_INFO.company}. All rights reserved.
                </div>
            </div>
        </footer>
    );
} 