


interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;  
}

export let currentPage: PaginationProps['currentPage'];
export let onPageChange: PaginationProps['onPageChange'];
export let totalPages: PaginationProps['totalPages'] = 1;  
