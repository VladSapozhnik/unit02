import { inject, injectable } from 'inversify';
import { PostsQueryRepository } from '../repositories/posts.query.repository';
import { LikesQueryService } from '../../likes/application/likes.query.service';
import { ExtendedLikesInfoType } from '../../likes/types/extended-likes-info.type';
import { postMapper } from '../mappers/posts.mapper';
import { PostsDocument } from '../entities/post.entity';
import { PostQueryInput } from '../routes/input/post-query.input';
import { PostOutputType } from '../types/post-output.type';
import { postListPaginatedOutputMapper } from '../mappers/post-list-paginated-output.mapper';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';

@injectable()
export class PostsQueryService {
  constructor(
    @inject(PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
    @inject(LikesQueryService)
    private readonly likesQueryService: LikesQueryService,
  ) {}
  async getPosts(
    queryDto: PostQueryInput,
    userId: string | undefined,
    blogId?: string,
  ) {
    const { posts, pagination } = await this.postsQueryRepository.getPosts(
      queryDto,
      blogId,
    );

    const postsOutput: PostOutputType[] = await Promise.all(
      posts.map(async (post: PostsDocument) => {
        const extendedLikesInfoType: ExtendedLikesInfoType =
          await this.likesQueryService.likesInfoForPosts(
            post._id.toString(),
            userId,
          );

        return postMapper(post, extendedLikesInfoType);
      }),
    );

    return postListPaginatedOutputMapper(postsOutput, pagination);
  }
  async getPostById(
    id: string,
    userId: string | undefined,
  ): Promise<PostOutputType | null> {
    const likesInfo: ExtendedLikesInfoType =
      await this.likesQueryService.likesInfoForPosts(id, userId);

    const post: PostsDocument | null =
      await this.postsQueryRepository.getPostById(id);

    if (!post) {
      return null;
    }

    return postMapper(post, likesInfo);
  }
}
