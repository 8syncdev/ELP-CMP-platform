'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useExercise } from '@/providers';
import { useEffect, useState } from 'react';

export function ExercisePagination() {
    const {
        handlePageChange,
        pagination
    } = useExercise();
    const [activePage, setActivePage] = useState(pagination?.current || 1);

    useEffect(() => {
        if (pagination) {
            setActivePage(pagination.current);
        }
    }, [pagination]);

    const getPageNumbers = () => {
        if (!pagination) return [];
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= pagination.totalPages; i++) {
            if (
                i === 1 ||
                i === pagination.totalPages ||
                (i >= activePage - delta && i <= activePage + delta)
            ) {
                range.push(i);
            }
        }

        let l;
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const onPageChange = async (page: number) => {
        if (!pagination) return;
        if (page !== activePage && page >= 1 && page <= pagination.totalPages) {
            setActivePage(page);
            await handlePageChange(page);
        }
    };

    if (!pagination || pagination.totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (activePage > 1) onPageChange(activePage - 1);
                        }}
                        className={activePage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                isActive={activePage === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page as number);
                                }}
                                className={`${activePage === page ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (activePage < pagination.totalPages) onPageChange(activePage + 1);
                        }}
                        className={activePage >= pagination.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
} 