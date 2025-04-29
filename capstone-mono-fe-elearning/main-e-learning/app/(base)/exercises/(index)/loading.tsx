'use client';

import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { FC } from 'react';

const ExercisesLoading: FC = () => {
    return (
        <div className="container py-8 mx-auto space-y-6">
            <Skeleton className="h-8 w-48" /> {/* Tiêu đề */}

            {/* Filter section loading */}
            <Card className="space-y-6 p-4 sm:p-6">
                <div className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-[100px]" />
                    </div>
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-10 w-[200px]" />
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-6 w-36" />
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-6 w-24" />
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-6 w-32" />
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-6 w-20" />
                        ))}
                    </div>
                </div>
            </Card>

            {/* Table loading */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((row) => (
                            <TableRow key={row}>
                                <TableCell><Skeleton className="h-6 w-[200px]" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination loading */}
            <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-10" />
                ))}
            </div>
        </div>
    );
}

export default ExercisesLoading;
