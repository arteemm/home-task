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
            message: `${field} not exist`,
            field: field
    });
};

const getNotCorrectMessage = (message: string, field: string): ErrorMessage => {
    return ({
            message: message,
            field: field
    });
};

type PropsName = 'name' | 'description' | 'title' | 'shortDescription' | 'content';

interface SimpleErrorObj  {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        IS_TOO_LONG: ErrorMessage;
};

type SimpleErrorsType = Record<PropsName, SimpleErrorObj>

type OtherErrorsType = {
    websiteUrl: SimpleErrorObj & { NOT_CORRECT: ErrorMessage },
    blogId: Omit<SimpleErrorObj, 'IS_TOO_LONG'> & { NOT_FIND_BLOG_ID: ErrorMessage },
    id_not_exist : string;
    createdAt: Omit<SimpleErrorObj, 'IS_TOO_LONG'> & { NOT_DATE: ErrorMessage },
    isMembership: Pick<SimpleErrorObj, 'NOT_FIND'> & { NOT_A_BOOLEAN: ErrorMessage },
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
    }
};
