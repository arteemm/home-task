import { Blog } from '../blogs/types/blogs';
import { Post } from '../posts/types/posts';

export const db = {
    blogs: <Blog[]>[
        {
            // id: '1',
            name: 'blog1',
            description: 'description1',
            websiteUrl: 'website1',
        },
    
        {
            id: '2',
            name: 'blog2',
            description: 'description2',
            websiteUrl: 'website2',
        },
    
        {
            id: '3',
            name: 'blog3',
            description: 'description3',
            websiteUrl: 'website3',
        },
    
    ],
    posts: <Post[]> [
        {
            id: 'post1',
            title: 'title1',
            shortDescription: 'shortDescription1',
            content: 'content1',
            blogId: 'blogId1',
            blogName: 'blogName1',
        },
        {
            id: 'post12',
            title: 'title12',
            shortDescription: 'shortDescription12',
            content: 'content12',
            blogId: 'blogId12',
            blogName: 'blogName12',
        },
        {
            id: 'post13',
            title: 'title13',
            shortDescription: 'shortDescription13',
            content: 'content13',
            blogId: 'blogId13',
            blogName: 'blogName13',
        },
    ]
};