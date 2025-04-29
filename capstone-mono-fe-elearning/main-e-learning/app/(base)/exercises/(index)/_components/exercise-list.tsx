'use client';

import { useExercise } from '@/providers';
import { ExerciseDto, ExerciseFilterTime } from '@/lib/actions/exercise';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, Users, ArrowUpDown, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { processTextContent } from '@/components/shared/dev/mdx/processor';
import * as React from "react";
import {
    ColumnDef,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DIFFICULTY_STYLES = {
    'Easy': 'bg-green-100 text-green-800',
    'Medium Easy': 'bg-blue-100 text-blue-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Medium Hard': 'bg-orange-100 text-orange-800',
    'Hard': 'bg-red-100 text-red-800',
    'Super Hard': 'bg-purple-100 text-purple-800'
};

interface Props {
    initialData: ExerciseDto[];
}

const COLUMN_LABELS = {
    'metadata_title': 'Tiêu đề',
    'metadata_difficulty': 'Độ khó',
    'metadata_tags': 'Chủ đề',
    'metadata_language': 'Ngôn ngữ',
    'metadata_author': 'Tác giả',
    'metadata_lastModifiedTime': 'Thời gian cập nhật'
} as const;

export function ExerciseList({ initialData }: Props) {
    const { exercises = initialData, isLoading, setFilter, currentFilter } = useExercise();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>("Easy");
    const [selectedTime, setSelectedTime] = React.useState<ExerciseFilterTime>("all");
    const [selectedTitle, setSelectedTitle] = React.useState<string>("");

    const handleSearch = () => {
        setFilter({
            title: selectedTitle,
            tags: [],
            difficulty: selectedDifficulty,
            filterTime: selectedTime
        });
    }

    const handleDifficultyChange = () => {
        handleSearch();
        if (selectedDifficulty === "Easy") {
            setSelectedDifficulty("Super Hard");
        } else {
            setSelectedDifficulty("Easy");
        }
    }

    const handleTimeChange = () => {
        handleSearch();
        if (selectedTime === "all") {
            setSelectedTime("newest");
        } else {
            setSelectedTime("all");
        }
    }

    const handleTitleChange = () => {
        handleSearch();
    }

    const columns: ColumnDef<ExerciseDto>[] = [
        {
            accessorKey: "metadata.title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            column.toggleSorting(column.getIsSorted() === "asc");
                            handleTitleChange();
                        }}
                        className="hover:bg-transparent"
                    >
                        Tiêu đề
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <Link href={`/exercises/${row.original.slug}`} className="block">
                    <div className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                        <div dangerouslySetInnerHTML={{ __html: processTextContent(row.original.metadata.title) }} />
                    </div>
                </Link>
            ),
        },
        {
            accessorKey: "metadata.difficulty",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            column.toggleSorting(column.getIsSorted() === "asc");
                            handleDifficultyChange();
                        }}
                        className="hover:bg-transparent"
                    >
                        Độ khó
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <Badge
                    variant="secondary"
                    className={DIFFICULTY_STYLES[row.original.metadata.difficulty as keyof typeof DIFFICULTY_STYLES]}
                >
                    {row.original.metadata.difficulty}
                </Badge>
            ),
        },
        {
            accessorKey: "metadata.tags",
            header: "Chủ đề",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {row.original.metadata.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs whitespace-nowrap"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "metadata.language",
            header: "Ngôn ngữ",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate max-w-[80px]">
                        {row.original.metadata.language.join(', ')}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "metadata.author",
            header: "Tác giả",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate max-w-[80px]">
                        {row.original.metadata.author}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "metadata.lastModifiedTime",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            column.toggleSorting(column.getIsSorted() === "asc");
                            handleTimeChange();
                        }}
                        className="hover:bg-transparent"
                    >
                        Cập nhật
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm whitespace-nowrap">
                        {format(
                            new Date(row.original.metadata.lastModifiedTime),
                            'dd MMM yyyy',
                            { locale: vi }
                        )}
                    </span>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: exercises,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnVisibility,
        },
    });

    if (isLoading) {
        return (
            <div className="w-full min-h-[500px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Độ khó</TableHead>
                            <TableHead>Chủ đề</TableHead>
                            <TableHead>Ngôn ngữ</TableHead>
                            <TableHead>Tác giả</TableHead>
                            <TableHead>Cập nhật</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3].map((i) => (
                            <TableRow key={i}>
                                <TableCell className="animate-pulse bg-gray-100 h-12"></TableCell>
                                <TableCell className="animate-pulse bg-gray-100 h-12"></TableCell>
                                <TableCell className="animate-pulse bg-gray-100 h-12"></TableCell>
                                <TableCell className="animate-pulse bg-gray-100 h-12"></TableCell>
                                <TableCell className="animate-pulse bg-gray-100 h-12"></TableCell>
                                <TableCell className="animate-pulse bg-gray-100 h-12"></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-end py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Tùy chỉnh hiển thị <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Hiển thị cột</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    const columnId = column.id as keyof typeof COLUMN_LABELS;
                                    console.log(columnId);
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {COLUMN_LABELS[columnId] || columnId}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                table.getAllColumns().forEach(col => col.toggleVisibility(true));
                            }}
                        >
                            Hiển thị tất cả
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-muted/50 cursor-pointer group"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Không có kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 