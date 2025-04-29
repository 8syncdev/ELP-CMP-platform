'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from '@/components/ui/sidebar';

export function BreadcrumbUI() {
    const pathname = usePathname();

    // Bỏ qua path đầu tiên (thường là '')
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    // Chuyển đổi các segment thành định dạng hiển thị (viết hoa chữ cái đầu và thay thế dấu gạch ngang)
    const formatSegment = (segment: string) => {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    {pathSegments.map((segment, index) => {
                        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathSegments.length - 1;

                        return (
                            <div key={segment} className="flex items-center">
                                <BreadcrumbItem className={index < pathSegments.length - 2 ? "hidden md:block" : ""}>
                                    {isLast ? (
                                        <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={href} asChild>
                                            <Link href={href}>
                                                {formatSegment(segment)}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {!isLast && (
                                    <BreadcrumbSeparator className={index < pathSegments.length - 2 ? "hidden md:block" : ""} />
                                )}
                            </div>
                        );
                    })}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}

