import { BlogModel, BlogDocument } from '../domain/blog.entity';
import { BlogQueryInput } from '../types/blog-query-input';
import { BlogViewModel } from '../types/blog-view-model';
import { WithId, ObjectId } from 'mongodb';
import { injectable } from 'inversify';


@injectable()
export class BlogsQueryRepository {
    constructor() {}

    async findAll(queryDto: BlogQueryInput): Promise<{ items: BlogViewModel[]; totalCount: number }> {
        const {
            searchNameTerm,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (+pageNumber - 1) * +pageSize;
        const filter = searchNameTerm ? { name: {$regex : `${searchNameTerm}`, $options: 'i'}} : {};

        const items = await BlogModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(+pageSize)  
            // .lean(); 

        const totalCount = await BlogModel.countDocuments(filter);
        return { items: this._mapToListBlogsViewModel(items), totalCount};
    }

   async findById(id: string): Promise<BlogViewModel | null>{
        if (!ObjectId.isValid(id)) {
            return new Promise((res, rej) => {
               return res(null)
            });
        }

        const result = await BlogModel.findOne({_id: new ObjectId(id)});

        return result ? this._mapToBlogViewModel(result) : null;
    }

    _mapToBlogViewModel(data: WithId<BlogDocument>): BlogViewModel {
        return {
             id: data._id.toString(),
            name : data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: data.createdAt,
            isMembership: data.isMembership,
        }
    }

    _mapToListBlogsViewModel(data: WithId<BlogDocument>[]): BlogViewModel[] {
        return data.map((item: WithId<BlogDocument>) => {
            return {
                id: item._id.toString(),
                name : item.name,
                description: item.description,
                websiteUrl: item.websiteUrl,
                createdAt: item.createdAt,
                isMembership: item.isMembership,
            };
        });
    }
};
