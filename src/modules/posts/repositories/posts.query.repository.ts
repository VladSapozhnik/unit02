import { Types } from 'mongoose';
import { PostQueryInput } from '../routes/input/post-query.input';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';
import { PaginatedMetaType } from '../../../core/types/paginated-meta.type';
import { buildPaginationHelper } from '../../../core/helpers/build-pagination.helper';
import { injectable } from 'inversify';
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

    return {
      posts,
      pagination,
    };
  }

  async getPostById(id: string): Promise<PostsDocument | null> {
    return PostModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }
}
