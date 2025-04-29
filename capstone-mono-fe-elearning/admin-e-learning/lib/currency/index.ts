export interface FormatCurrencyOptions {
    locale?: string;
    currency?: string;
}

export function formatCurrency(value: number, options: FormatCurrencyOptions = {}) {
    const { locale = 'vi-VN', currency = 'VND' } = options;
    return Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
