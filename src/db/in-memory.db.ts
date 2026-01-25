import { Video, AvailableResolutions } from '../videos/types/video';

export const db = {
    videos: <Video[]>[
        {
            id: 1,
            title: 'title1',
            author: 'author1',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [ AvailableResolutions.P144 ],
        },
        {
            id: 2,
            title: 'title2',
            author: 'author2',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [ AvailableResolutions.P1440, AvailableResolutions.P240 ],
        },
        {
            id: 3,
            title: 'title3',
            author: 'author3',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: [ AvailableResolutions.P480 ],
        },
    ]
};