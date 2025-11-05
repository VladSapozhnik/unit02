import { PostType } from '../types/post.type';
import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../../core/db/mango.db';
import { PostQueryInput } from '../routes/input/post-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { postMapper } from '../routes/mappers/posts.mapper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';

export const postsQueryRepository = {
  // async getAllPosts(
  //   queryDto: PostQueryInput,
  // ): Promise<ItemsAndTotalCountType<WithId<PostType>>> {
  //   const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);
  //
  //   const posts: WithId<PostType>[] = await postCollection
  //     .find()
  //     .sort({ [queryDto.sortBy]: queryDto.sortDirection })
  //     .limit(queryDto.pageSize)
  //     .skip(skip)
  //     .toArray();
  //
  //   const totalCount: number = await postCollection.countDocuments();
  //
  //   return { items: posts, totalCount };
  // },

  async getPosts(queryDto: PostQueryInput, blogId?: string) {
    const filter: any = {};

    if (blogId) {
      filter.blogId = blogId;
    }

    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const posts: WithId<PostType>[] = await postCollection
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(skip)
      .toArray();

    const totalCount: number = await postCollection.countDocuments(filter);

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return paginatedListMapper(posts, pagination, postMapper);
  },

  async getPostById(id: ObjectId | string): Promise<PostType | null> {
    const post: WithId<PostType> | null = await postCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!post) {
      return null;
    }

    return postMapper(post);
  },
};
