import { PostType } from '../types/post.type';
import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../../core/db/mango.db';
import { PostQueryInput } from '../routes/input/post-query.input';
import { ItemsAndTotalCountType } from '../../../core/types/items-and-total-count.type';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';

export const postsQueryRepository = {
  async getAllPosts(
    queryDto: PostQueryInput,
  ): Promise<ItemsAndTotalCountType<WithId<PostType>>> {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const posts: WithId<PostType>[] = await postCollection
      .find()
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(skip)
      .toArray();

    const totalCount: number = await postCollection.countDocuments();

    return { items: posts, totalCount };
  },

  async getPostsByBlogId(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<ItemsAndTotalCountType<WithId<PostType>>> {
    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const posts: WithId<PostType>[] = await postCollection
      .find({ blogId })
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(skip)
      .toArray();

    const totalCount: number = await postCollection.countDocuments({ blogId });

    return { items: posts, totalCount };
  },

  async getPostById(id: string): Promise<WithId<PostType> | null> {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  },
};
