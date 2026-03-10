import { SortDirection } from '../../core/types/sort-direction';

export type CommentQueryInput = {
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortDirection: SortDirection;
};