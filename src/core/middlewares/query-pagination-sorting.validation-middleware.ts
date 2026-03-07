import { query } from 'express-validator';
import { SortDirection } from '../types/sort-direction'
import { PaginationAndSorting } from '../types/pagination-and-sorting';
import { errorsHandler } from './errorsHandlerMiddleware';


const DEFAULT_SEARCH_NAME_TERM = null;
const DEFAULT_SEARCH_LOGIN_TERM = null;
const DEFAULT_SEARCH_EMAIL_TERM = null;
const DEFAULT_PAGE_NUMBER = '1';
const DEFAULT_PAGE_SIZE = '10';
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;
const DEFAULT_SORT_BY = 'createdAt';

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
    searchNameTerm: DEFAULT_SEARCH_NAME_TERM,
    searchLoginTerm: DEFAULT_SEARCH_LOGIN_TERM,
    searchEmailTerm: DEFAULT_SEARCH_EMAIL_TERM,
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: DEFAULT_SORT_BY,
    sortDirection: DEFAULT_SORT_DIRECTION,
};

export function paginationAndSortingValidation<T extends string>(
   sortFieldsEnum: Record<string, T>,
) {
  const allowedSortFields = Object.values(sortFieldsEnum);

  return [
    query('searchNameTerm')
      .default(DEFAULT_SEARCH_NAME_TERM)
      .isString()
      .optional({ nullable: true })
      .withMessage('SearchNameTerm must be a string'),
  
    query('searchLoginTerm')
      .default(DEFAULT_SEARCH_LOGIN_TERM)
      .isString()
      .optional({ nullable: true })
      .withMessage('searchLoginTerm must be a string'),
  
    query('searchEmailTerm')
      .default(DEFAULT_SEARCH_EMAIL_TERM)
      .isString()
      .optional({ nullable: true })
      .withMessage('searchEmailTerm must be a string'),

    query('pageNumber')
      .default(DEFAULT_PAGE_NUMBER)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),

    query('pageSize')
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1, max: 100 })
      .withMessage('Page size must be between 1 and 100')
      .toInt(),

    query('sortBy')
      .default(DEFAULT_SORT_BY)
      .isIn(allowedSortFields)
      .withMessage(
        `Invalid sort field. Allowed values: ${allowedSortFields.join(', ')}`,
      ),

    query('sortDirection')
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirection).join(', ')}`,
      ),

      errorsHandler
  ];
};
