import { ApiErrorsType } from '../types/errorsMessagesTypes';


export const API_ERRORS: ApiErrorsType = {
    title: {
        NOT_A_STRING: {
            message: 'title is not a string',
            field: 'title'
        },
        NOT_FIND: {
            message: 'title is not find',
            field: 'title'
        },
        IS_TOO_LONG: {
            message: 'title length is too long',
            field: 'title'
        },
    },
    author: {
        NOT_A_STRING: {
            message: 'author is not a string',
            field: 'author'
        },
        NOT_FIND: {
            message: 'author is not find',
            field: 'author'
        },
        IS_TOO_LONG: {
            message: 'author length is too long',
            field: 'author'
        },
    },
    availableResolutions: {
        NOT_ARRAY: {
            message: 'availableResolutions is not a array',
            field: 'availableResolutions'
        },
        NOT_FIND: {
            message: 'there are not enum',
            field: 'availableResolutions'
        },
    },
    publicationDate: {
        NOT_A_STRING: {
            message: 'publicationDate is not a string',
            field: 'publicationDate'
        },
        NOT_FIND: {
            message: 'publicationDate is not find',
            field: 'publicationDate'
        },
    },
    canBeDownloaded: {
        NOT_A_BOOLEAN: {
            message: 'canBeDownloaded is not a boolean',
            field: 'canBeDownloaded'
        },
        NOT_FIND: {
            message: 'canBeDownloaded is not find',
            field: 'canBeDownloaded'
        },
    },
    minAgeRestriction: {
        NOT_A_NUMBER: {
            message: 'minAgeRestriction is not a number',
            field: 'minAgeRestriction'
        },
        NOT_FIND: {
            message: 'minAgeRestriction is not find',
            field: 'minAgeRestriction'
        },
        NOT_CORRECT: {
            message: 'minAgeRestriction < 1 or > 18',
            field: 'minAgeRestriction'
        },
    },
};
