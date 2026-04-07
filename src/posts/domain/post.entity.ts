import { CreatePostDto } from '../types/create-post-dto';

export class Post {
    constructor(       
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,

    ) {}

    static create(dto: CreatePostDto, blogName: string): Post {
        return new this(
          dto.title,
          dto.shortDescription,
          dto.content,
          dto.blogId,
          blogName,
          new Date().toISOString(),
        )
    }
}
