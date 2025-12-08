import { PostType } from '../types/post.type';
import { ObjectId, WithId } from 'mongodb';
import { postsCollection } from '../../../core/db/mango.db';
import { PostQueryInput } from '../routes/input/post-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { postMapper } from '../mappers/posts.mapper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';
import { injectable } from 'inversify';

@injectable()
export class PostsQueryRepository {
  async getPosts(queryDto: PostQueryInput, blogId?: string) {
    const filter: any = {};

    if (blogId) {
      filter.blogId = blogId;
    }

    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const posts: WithId<PostType>[] = await postsCollection
      .find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(skip)
      .toArray();

    const totalCount: number = await postsCollection.countDocuments(filter);

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return paginatedListMapper<PostType>(posts, pagination, postMapper);
  }

  async getPostById(id: ObjectId | string): Promise<PostType | null> {
    const post: WithId<PostType> | null = await postsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!post) {
      return null;
    }

    return postMapper(post);
  }
}

// export const postsQueryRepository = {
//   async getPosts(queryDto: PostQueryInput, blogId?: string) {
//     const filter: any = {};
//
//     if (blogId) {
//       filter.blogId = blogId;
//     }
//
//     const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);
//
//     const posts: WithId<PostType>[] = await postsCollection
//       .find(filter)
//       .sort({ [queryDto.sortBy]: queryDto.sortDirection })
//       .limit(queryDto.pageSize)
//       .skip(skip)
//       .toArray();
//
//     const totalCount: number = await postsCollection.countDocuments(filter);
//
//     const pagination: PaginatedMetaType = buildPaginationHelper(
//       totalCount,
//       queryDto.pageNumber,
//       queryDto.pageSize,
//     );
//
//     return paginatedListMapper<PostType>(posts, pagination, postMapper);
//   },
//
//   async getPostById(id: ObjectId | string): Promise<PostType | null> {
//     const post: WithId<PostType> | null = await postsCollection.findOne({
//       _id: new ObjectId(id),
//     });
//
//     if (!post) {
//       return null;
//     }
//
//     return postMapper(post);
//   },
// };
