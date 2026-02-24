import { SortDirection } from './sort-direction';

export type PaginationAndSorting<T> = {
    searchNameTerm: string | null;
    pageNumber: string;
    pageSize: string;
    sortBy: T;
    sortDirection: SortDirection;
};

