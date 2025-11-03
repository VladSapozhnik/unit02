import { BlogType } from '../types/blog.type';
import { blogCollection } from '../../../core/db/mango.db';
import { ObjectId, WithId } from 'mongodb';
import { BlogQueryInput } from '../routes/input/blog-query.input';
import { ItemsAndTotalCountType } from '../../../core/types/items-and-total-count.type';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';

export const blogsQueryRepository = {
  async getBlogs(
    queryDto: BlogQueryInput,
  ): Promise<ItemsAndTotalCountType<WithId<BlogType>>> {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const filter: any = {};

    if (queryDto.searchNameTerm) {
      filter.name = { $regex: queryDto.searchNameTerm, $options: 'i' };
    }

    const items: WithId<BlogType>[] = await blogCollection
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .skip(skip)
      .limit(queryDto.pageSize)
      .toArray();

    const totalCount: number = await blogCollection.countDocuments(filter);
    return { items, totalCount };
  },

  async getBlogById(id: string): Promise<WithId<BlogType> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },
};
