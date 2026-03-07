import { SortDirection } from '../../core/types/sort-direction';

export type UserQueryInput = {
    searchLoginTerm: string | null;
    searchEmailTerm: string | null;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortDirection: SortDirection;
};