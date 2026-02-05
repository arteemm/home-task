export type ErrorMessage = {
    message: string;
    field: string;
};

export type ErrorsMessages = {
    errorsMessages: ErrorMessage[]
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
    }
};

export const API_ERRORS: ApiErrorsType = {
    name: {
        NOT_A_STRING: {
            message: 'is not a string',
            field: 'name'
        },
        NOT_FIND: {
            message: 'something is empty',
            field: 'name'
        },
        IS_TOO_LONG: {
            message: 'length more than 15 symbols',
            field: 'name'
        },
    },
    description: {
        NOT_A_STRING: {
            message: 'is not a string',
            field: 'description'
        },
        NOT_FIND: {
            message: 'something is empty',
            field: 'description'
        },
        IS_TOO_LONG: {
            message: 'length more than 500 symbols',
            field: 'description'
        },
    },
    websiteUrl: {
        NOT_A_STRING: {
            message: 'is not a string',
            field: 'websiteUrl'
        },
        NOT_FIND: {
            message: 'something is empty',
            field: 'websiteUrl'
        },
        NOT_CORRECT: {
            message: 'length more than 100 symbols',
            field: 'websiteUrl'
        },
    },
    title: {
        NOT_A_STRING: {
            message: 'is not a string',
            field: 'title'
        },
        NOT_FIND: {
            message: 'something is empty',
            field: 'title'
        },
        IS_TOO_LONG: {
            message: 'length more than 30 symbols',
            field: 'title'
        },
    },
    shortDescription: {
        NOT_A_STRING: {
            message: 'is not a string',
            field: 'shortDescription'
        },
        NOT_FIND: {
            message: 'something is empty',
            field: 'shortDescription'
        },
        IS_TOO_LONG: {
            message: 'length more than 100 symbols',
            field: 'shortDescription'
        },
    },
    content: {
        NOT_A_STRING: {
            message: 'is not a string',
            field: 'content'
        },
        NOT_FIND: {
            message: 'something is empty',
            field: 'content'
        },
        IS_TOO_LONG: {
            message: 'length more than 1000 symbols',
            field: 'content'
        },
    },
    blogId: {
        NOT_A_STRING: {
            message: 'is not a string',
            field: 'blogId'
        },
        NOT_FIND: {
            message: 'something is empty',
            field: 'blogId'
        },
        NOT_FIND_BLOG_ID: {
            message: 'blog id did not find',
            field: 'blogId'
        },
    }
};
