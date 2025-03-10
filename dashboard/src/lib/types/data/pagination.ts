export function paginate(items: any[], currentPage: number, itemsPerPage: number) {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = items.slice(startIndex, endIndex);
  
    const maxVisiblePages = 5;
    let pageNumbers: (number | string)[] = [];
  
    if (totalPages <= maxVisiblePages) {
        pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        if (currentPage <= 3) {
            pageNumbers = [1, 2, 3, 4, '...', totalPages];
        } else if (currentPage >= totalPages - 2) {
            pageNumbers = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }
  
    return {
        items: currentItems,
        currentPage,
        totalPages,
        pageNumbers,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
  }
  