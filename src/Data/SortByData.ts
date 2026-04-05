// Hàm sort chung, đảm bảo loại dữ liệu trả về là mảng T[]
function sortByField<T>(data: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (typeof aVal === 'string' && typeof bVal === 'string')
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)

    if (typeof aVal === 'number' && typeof bVal === 'number')
      return order === 'asc' ? aVal - bVal : bVal - aVal

    if (aVal instanceof Date && bVal instanceof Date)
      return order === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime()

    return 0
  })
}
