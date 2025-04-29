"use client"

import React, { useState } from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Enrollment, columns } from './columns'
import { SearchEnrollment } from './search-enrollment'
import { CreateEnrollment } from './create-enrollment'
import { Pagination } from './pagination'
import { ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EnrollmentTableProps {
    data: Enrollment[]
    totalPages: number
    currentPage: number
    limit: number
}

export function EnrollmentTable({ data, totalPages, currentPage, limit }: EnrollmentTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [isLoading, setIsLoading] = useState(false)

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Quản lý đăng ký khóa học</h1>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Cột hiển thị <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id === "id" && "ID"}
                                            {column.id === "user_id" && "ID Người dùng"}
                                            {column.id === "course_id" && "ID Khóa học"}
                                            {column.id === "status" && "Trạng thái"}
                                            {column.id === "expires_at" && "Ngày hết hạn"}
                                            {column.id === "created_at" && "Ngày tạo"}
                                            {column.id === "actions" && "Hành động"}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CreateEnrollment />
                </div>
            </div>
            <div className={`rounded-md border relative ${isLoading ? 'min-h-[200px]' : ''}`}>
                {isLoading && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                            <span className="text-sm text-muted-foreground animate-pulse">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                )}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead colSpan={table.getVisibleLeafColumns().length} className="py-3">
                                <SearchEnrollment />
                            </TableHead>
                        </TableRow>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted/20 hover:bg-muted/30 transition-colors">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={
                                                header.id === "id" ||
                                                    header.id === "user_id" ||
                                                    header.id === "course_id"
                                                    ? "text-center font-medium text-muted-foreground"
                                                    : header.id === "status"
                                                        ? "text-center font-medium"
                                                        : "font-medium"
                                            }
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    className="border-b transition-colors hover:bg-muted/30 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={
                                                cell.column.id === "id" ||
                                                    cell.column.id === "user_id" ||
                                                    cell.column.id === "course_id"
                                                    ? "px-3 py-2"
                                                    : "py-2"
                                            }
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {isLoading ? (
                                        <span className="text-muted-foreground animate-pulse">Đang tải dữ liệu...</span>
                                    ) : (
                                        <span>Không tìm thấy dữ liệu</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                limit={limit}
            />
        </div>
    )
} 