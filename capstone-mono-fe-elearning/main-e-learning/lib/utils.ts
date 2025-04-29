import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export function formatDuration(duration: number) {
  return `${duration} giờ`
}

export function formatDate(date: Date, formatString: string = 'dd MMM, yyyy') {
  return format(date, formatString, { locale: vi })
}