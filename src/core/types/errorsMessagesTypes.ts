export type ErrorMessage = {
    message: string;
    field: string;
};

export type ErrorsMessages = {
    errorsMessages: ErrorMessage[]
};

export type ApiErrorsType = {
    title: {
        [propName: string] : ErrorMessage;
    },
    author: {
        [propName: string] : ErrorMessage;
    },
    availableResolutions: {
        [propName: string] : ErrorMessage;
    },
    publicationDate: {
        [propName: string] : ErrorMessage;
    },
    canBeDownloaded: {
        [propName: string] : ErrorMessage;
    },
    minAgeRestriction: {
        [propName: string] : ErrorMessage;
    },
};
