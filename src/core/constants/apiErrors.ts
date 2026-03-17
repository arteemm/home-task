export type ErrorMessage = {
    message: string;
    field: string;
};


export type ErrorsMessages = {
    errorsMessages: ErrorMessage[]
};

const getNotFindMessage = (field: string): ErrorMessage => {
    return ({
        message: `${field} not exist`,
        field: field
    });
};

const getNotStringMessage = (field: string): ErrorMessage => {
    return ({
        message: `${field} not a string`,
        field: field
    });
};

const getNotCorrectMessage = (message: string, field: string): ErrorMessage => {
    return ({
        message: message,
        field: field
    });
};

enum PropsName {
    name = 'name',
    description = 'description',
    title = 'title',
    shortDescription = 'shortDescription',
    content = 'content',
    loginOrEmail = 'loginOrEmail',
    password = 'password',
};

interface SimpleErrorObj  {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        IS_TOO_LONG: ErrorMessage;
};

type SimpleErrorsType = Record<PropsName, SimpleErrorObj>;

type OtherErrorsType = {
    websiteUrl: SimpleErrorObj & { NOT_CORRECT: ErrorMessage },
    blogId: Omit<SimpleErrorObj, 'IS_TOO_LONG'> & { NOT_FIND_BLOG_ID: ErrorMessage },
    id_not_exist : string;
    createdAt: Omit<SimpleErrorObj, 'IS_TOO_LONG'> & { NOT_DATE: ErrorMessage },
    isMembership: Pick<SimpleErrorObj, 'NOT_FIND'> & { NOT_A_BOOLEAN: ErrorMessage },
    login: SimpleErrorObj & { NOT_CORRECT: ErrorMessage, MUST_BE_UNIQUE: ErrorMessage },
    email: Omit<SimpleErrorObj, 'IS_TOO_LONG'> & { NOT_CORRECT: ErrorMessage, MUST_BE_UNIQUE: ErrorMessage, APPLIED: ErrorMessage },
    code: Omit<SimpleErrorObj, 'IS_TOO_LONG'> & { EXPIRED: ErrorMessage, APPLIED: ErrorMessage},
};

export type  ApiErrorsType = SimpleErrorsType & OtherErrorsType;


export const API_ERRORS:  ApiErrorsType = {
    name: {
        NOT_A_STRING: getNotStringMessage('name'),
        NOT_FIND: getNotFindMessage('name'),
        IS_TOO_LONG: getNotCorrectMessage('length more than 15 symbols', 'name')
    },
    description: {
        NOT_A_STRING: getNotStringMessage('description'),
        NOT_FIND: getNotFindMessage('description'),
        IS_TOO_LONG: getNotCorrectMessage('length more than 500 symbols', 'name'),
    },
    websiteUrl: {
        NOT_A_STRING: getNotStringMessage('websiteUrl'),
        NOT_FIND: getNotFindMessage('websiteUrl'),
        IS_TOO_LONG: getNotCorrectMessage('length more than 100 symbols', 'websiteUrl'),
        NOT_CORRECT: getNotCorrectMessage('websiteUrl does not match the pattern ', 'websiteUrl'),
    },
    title: {
        NOT_A_STRING: getNotStringMessage('title'),
        NOT_FIND: getNotFindMessage('title'),
        IS_TOO_LONG: getNotCorrectMessage('length more than 30 symbols', 'title'),
    },
    shortDescription: {
        NOT_A_STRING: getNotStringMessage('shortDescription'),
        NOT_FIND: getNotFindMessage('shortDescription'),
        IS_TOO_LONG: getNotCorrectMessage('length more than 100 symbols', 'shortDescription'),
    },
    content: {
        NOT_A_STRING: getNotStringMessage('content'),
        NOT_FIND: getNotFindMessage('content'),
        IS_TOO_LONG: getNotCorrectMessage('length more than 1000 symbols', 'content'),
    },
    blogId: {
        NOT_A_STRING: getNotStringMessage('blogId'),
        NOT_FIND: getNotFindMessage('blogId'),
        NOT_FIND_BLOG_ID: {
            message: 'blog id did not find',
            field: 'blogId'
        },
    },
    id_not_exist : 'entity is not exist',
    createdAt: {
        NOT_A_STRING: getNotStringMessage('createdAt'),
        NOT_FIND: getNotFindMessage('createdAt'),
        NOT_DATE: getNotCorrectMessage('createdAt is not a date', 'createdAt')
    },
    isMembership: {
        NOT_FIND: getNotFindMessage('isMembership'),
        NOT_A_BOOLEAN: getNotCorrectMessage('isMembership is not a boolean', 'isMembership')
    },
    loginOrEmail: {
        NOT_A_STRING: getNotStringMessage('loginOrEmail'),
        NOT_FIND: getNotFindMessage('loginOrEmail'),
        IS_TOO_LONG: getNotCorrectMessage('length more than 1000 symbols', 'loginOrEmail'),
    },
    password: {
        NOT_A_STRING: getNotStringMessage('password'),
        NOT_FIND: getNotFindMessage('password'),
        IS_TOO_LONG: getNotCorrectMessage('length must be more than 6 and less than 20 symbols', 'password'),
    },
    login: {
        NOT_A_STRING: getNotStringMessage('login'),
        NOT_FIND: getNotFindMessage('login'),
        IS_TOO_LONG: getNotCorrectMessage('length must be more than 3 and less than 10 symbols', 'login'),
        NOT_CORRECT: getNotCorrectMessage('login does not match the pattern ', 'login'),
        MUST_BE_UNIQUE: getNotCorrectMessage('login must be Unique ', 'login'),
    },
    email: {
        NOT_A_STRING: getNotStringMessage('email'),
        NOT_FIND: getNotFindMessage('email'),
        NOT_CORRECT: getNotCorrectMessage('email does not match the pattern ', 'email'),
        MUST_BE_UNIQUE: getNotCorrectMessage('email must be Unique ', 'email'),
        APPLIED: getNotCorrectMessage('user has already been applied ', 'code'),
    },
    code: {
        NOT_FIND: getNotStringMessage('code'),
        NOT_A_STRING: getNotStringMessage('code'),
        EXPIRED: getNotCorrectMessage('code has been expired ', 'code'),
        APPLIED: getNotCorrectMessage('user has already been applied ', 'code'),
    }  
};


enum PaginatonAndSorting {
    searchNameTerm = 'searchNameTerm',
    searchLoginTerm = 'searchLoginTerm',
    searchEmailTerm = 'searchEmailTerm',
    pageNumber = 'pageNumber',
    pageSize = 'pageSize',
    sortBy = 'sortBy',
    sortDirection = 'sortDirection',
};

// export type PaginationAndSortingErrors = Record<PaginatonAndSorting, { MESSAGE : ErrorMessage }>;

// const paginationAndSortigErrors: PaginationAndSortingErrors = {
//     searchNameTerm: {
//         MESSAGE: getNotStringMessage('searchNameTerm')
//     },
//     searchLoginTerm: {
//         MESSAGE: getNotStringMessage('searchLoginTerm')
//     },
//     searchEmailTerm: {
//         MESSAGE: getNotStringMessage('searchEmailTerm')
//     },
//     pageNumber: {
//         MESSAGE: getNotCorrectMessage('pageNumber', 'Page number must be a positive integer')
//     },
//     pageSize: {
//         MESSAGE: getNotCorrectMessage('pageSize', 'Page size must be between 1 and 100')
//     },
    
// }