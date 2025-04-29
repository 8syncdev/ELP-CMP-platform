
export const formatDate = (date: string | Date) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}


export const toTitleCase = (str: string) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}
