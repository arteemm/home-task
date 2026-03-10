import { SortDirection } from '../../core/types/sort-direction';


export type BlogQueryInput = {
    searchNameTerm: string | null;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortDirection: SortDirection;
};
