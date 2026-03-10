import { SortDirection } from '../../core/types/sort-direction';

export type PostQueryInput = {
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortDirection: SortDirection;
};