export function oneWeekAgo(): string {
    const date: Date = new Date()
    date.setUTCDate(date.getUTCDate() - 7)
    return date.toISOString().replace("T", " ")
}