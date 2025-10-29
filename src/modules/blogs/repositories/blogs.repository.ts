import { BlogType } from '../types/blog.type';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { blogCollection } from '../../../core/db/mango.db';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import { BlogQueryInput } from '../routes/input/blog-query.input';
import { ResultAndTotalCountType } from '../../../core/types/result-and-total-count.type';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';

export const blogsRepository = {
  async getBlogs(
    queryDto: BlogQueryInput,
  ): Promise<ResultAndTotalCountType<WithId<BlogType>>> {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const filter: any = {};

    if (queryDto.searchBlogNameTerm) {
      filter.name = { $regex: queryDto.searchBlogNameTerm, $options: 'i' };
    }

    const items: WithId<BlogType>[] = await blogCollection
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(skip)
      .limit(queryDto.pageSize)
      .toArray();

    const totalCount: number = await blogCollection.countDocuments();
    return { items, totalCount };
  },

  async createBlog(body: BlogType): Promise<InsertOneResult<BlogType>> {
    return blogCollection.insertOne(body);
  },

  async getBlogById(id: string): Promise<WithId<BlogType> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async updateBlog(
    id: string,
    body: UpdateBlogDto,
  ): Promise<UpdateResult<BlogType>> {
    return blogCollection.updateOne({ _id: new ObjectId(id) }, { $set: body });
  },

  async removeBlogById(id: string): Promise<DeleteResult> {
    return await blogCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
