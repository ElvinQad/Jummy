import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
}

export const getPaginationData = ({ currentPage, totalItems, itemsPerPage }: PaginationProps) => {
  if (currentPage < 1 || itemsPerPage < 1 || totalItems < 0) {
    throw new Error('Invalid pagination parameters');
  }
  
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    totalPages,
    pages,
    startIndex,
    endIndex,
  }
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
}

export const fadeInVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export interface FilterConfig<T> {
  searchFields: (keyof T)[]
  searchQuery: string
  filters: Record<string, T[keyof T]>
}

interface FilterItemsOptions<T> {
  searchFields: (keyof T)[];
  searchQuery: string;
  filters: {
    [key: string]: string | number;
  };
}

export function filterItems<T>(
  items: T[],
  options: FilterItemsOptions<T>
): T[] {
  const { searchFields, searchQuery, filters } = options;
  
  return items.filter((item) => {
    // Search filter
    if (searchQuery) {
      const searchMatch = searchFields.some((field) => {
        const value = String(item[field] || '').toLowerCase();
        return value.includes(searchQuery.toLowerCase());
      });
      if (!searchMatch) return false;
    }

    // Other filters
    for (const [key, value] of Object.entries(filters)) {
      // Skip filtering if value is 'all' or empty
      if (!value || value === 'all') continue;

      // Handle numeric values (like rating)
      if (typeof value === 'number') {
        const itemValue = Number(item[key as keyof T]);
        if (isNaN(itemValue) || itemValue < value) return false;
        continue;
      }

      // Handle string values (like speciality)
      const itemValue = String(item[key as keyof T]).toLowerCase();
      const filterValue = String(value).toLowerCase();
      if (!itemValue.includes(filterValue)) {
        return false;
      }
    }

    return true;
  });
}
