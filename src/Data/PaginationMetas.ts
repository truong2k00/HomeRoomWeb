export const paginationMetas = (page: number, itemsPerPage: number, totalItem: number) => {
  return `Showing ${page} to ${itemsPerPage} of ${totalItem} entries`
}
