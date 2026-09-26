import clsx from 'clsx';
export function cn(...inputs) {
    return clsx(inputs);
}
export function formatDate(date, options) {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    if (isNaN(d.getTime()))
        return '';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        ...options,
    }).format(d);
}
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}
export function truncate(text, length) {
    if (text.length <= length)
        return text;
    return `${text.slice(0, length)}...`;
}
//# sourceMappingURL=index.js.map