import { Types } from 'mongoose';
import { PostQueryInput } from '../routes/input/post-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { postMapper } from '../mappers/posts.mapper';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { paginatedListMapper } from '../../../core/mappers/paginated-list.mapper';
import { injectable } from 'inversify';
import { PostOutputType } from '../types/post-output.type';
import { PostModel, PostsDocument } from '../entities/post.entity';

@injectable()
export class PostsQueryRepository {
  async getPosts(queryDto: PostQueryInput, blogId?: string) {
    const filter: any = {};

    if (blogId) {
      filter.blogId = blogId;
    }

    const skip: number = getSkipOffset(queryDto.pageNumber, queryDto.pageSize);

    const posts: PostsDocument[] = await PostModel.find(filter)
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(skip);

    const totalCount: number = await PostModel.countDocuments(filter);

    const pagination: PaginatedMetaType = buildPaginationHelper(
      totalCount,
      queryDto.pageNumber,
      queryDto.pageSize,
    );

    return paginatedListMapper<PostsDocument, PostOutputType>(
      posts,
      pagination,
      postMapper,
    );
  }

  async getPostById(id: string): Promise<PostOutputType | null> {
    const post: PostsDocument | null = await PostModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!post) {
      return null;
    }

    return postMapper(post);
  }
}
