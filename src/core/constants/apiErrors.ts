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

export type ApiErrorsType = {
    name: {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        IS_TOO_LONG: ErrorMessage;
    },
    description: {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        IS_TOO_LONG: ErrorMessage;
    },
    websiteUrl: {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        IS_TOO_LONG: ErrorMessage;
        NOT_CORRECT: ErrorMessage;
    },
    title : {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        IS_TOO_LONG: ErrorMessage;
    },
    shortDescription : {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        IS_TOO_LONG: ErrorMessage;
    },
    content : {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        IS_TOO_LONG: ErrorMessage;
    },
    blogId: {
        NOT_A_STRING : ErrorMessage;
        NOT_FIND: ErrorMessage;
        NOT_FIND_BLOG_ID: ErrorMessage;
    },
    id_not_exist : string;
};

export const API_ERRORS: ApiErrorsType = {
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
    id_not_exist : 'entity is not exist'
};
