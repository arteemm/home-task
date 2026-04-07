import { CreateBlogDto } from '../types/create-blog-dto';

export class Blog {
    constructor(       
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean,

    ) {}

    static create(dto: CreateBlogDto): Blog {
        return new this(
          dto.name,
          dto.description,
          dto.websiteUrl,
          new Date().toISOString(),
          false,
        )
    }
}