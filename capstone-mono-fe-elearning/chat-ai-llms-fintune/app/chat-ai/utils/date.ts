export function getDaysRemaining(dateString: number): number {
    const end = new Date(dateString);
    const now = new Date();
    return Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
} 