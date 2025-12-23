import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../../core/enums/http-status.enum';
import {
  RequestWithBody,
  RequestWithParam,
  RequestWithParamAndBody,
} from '../../../core/types/request.type';
import { CreatePostDto, CreatePostForBlogDto } from '../dto/create-post.dto';
import { BlogIdQueryDto } from '../dto/blogId-query.dto';
import { PostQueryInput } from './input/post-query.input';
import { matchedData } from 'express-validator';
import { PaginationAndSortingType } from '../../../core/types/pagination-and-sorting.type';
import { PostSortFieldEnum } from '../enums/post-sort-field.enum';
import { setDefaultSortAndPaginationIfNotExistHelper } from '../../../core/helpers/set-default-sort-and-pagination.helper';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { CommentQueryInput } from '../../comments/routes/input/comment-query.input';
import { CommentSortFieldEnum } from '../../comments/enums/comment-sort-field.enum';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { IdPostParamDto } from '../dto/id-post-param.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { inject, injectable } from 'inversify';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repositories/posts.query.repository';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query.repository';
import { PostsRepository } from '../repositories/posts.repository';
import { CommentsService } from '../../comments/application/comments.service';
import { PostOutputType } from '../types/post-output.type';
import { CommentOutputType } from '../../comments/types/comment-output.type';
import { BlogOutputType } from '../../blogs/types/blog-output.type';
import { CommentsQueryService } from '../../comments/application/comments.query.service';
import { PostsDocument } from '../entities/post.entity';
import { LikesService } from '../../likes/application/likes.service';
import { LikeStatusEnum } from '../../likes/enums/like-status.enum';

@injectable()
export class PostsController {
  constructor(
    @inject(PostsService) private readonly postsService: PostsService,
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
    @inject(BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
    @inject(CommentsService) private readonly commentsService: CommentsService,
    @inject(CommentsQueryService)
    private readonly commentsQueryService: CommentsQueryService,
    @inject(LikesService) private readonly likesService: LikesService,
  ) {}
  async createCommentForPost(req: Request, res: Response) {
    const userId: string = req.userId as string;
    const postId: string = req.params.postId;

    const id: string = await this.commentsService.createComment(
      userId,
      postId,
      req.body,
    );

    const findComment: CommentOutputType =
      await this.commentsQueryService.getCommentById(id, userId);

    res.status(HTTP_STATUS.CREATED_201).send(findComment);
  }

  async createPost(req: RequestWithBody<CreatePostDto>, res: Response) {
    const id: string = await this.postsService.createPost(req.body);

    const post: PostOutputType | null =
      await this.postsQueryRepository.getPostById(id);

    res.status(HTTP_STATUS.CREATED_201).send(post);
  }

  async createPostForBlog(
    req: RequestWithParamAndBody<BlogIdQueryDto, CreatePostForBlogDto>,
    res: Response,
  ) {
    const blogId: string = req.params.blogId;

    const id: string = await this.postsService.createPostForBlog({
      ...req.body,
      blogId,
    });

    const post: PostOutputType | null =
      await this.postsQueryRepository.getPostById(id);

    res.status(HTTP_STATUS.CREATED_201).send(post);
  }

  async getAllPosts(req: Request, res: Response) {
    try {
      const sanitizedQuery: PostQueryInput = matchedData<PostQueryInput>(req, {
        locations: ['query'],
      });

      const defaultQuery: PaginationAndSortingType<PostSortFieldEnum> =
        setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

      const postsOutput =
        await this.postsQueryRepository.getPosts(defaultQuery);

      res.json(postsOutput);
    } catch (e) {
      errorsHandler(e, res);
    }
  }

  async getCommentsForPostId(req: Request, res: Response) {
    const userId: string = req.userId as string;

    const sanitizedQuery: CommentQueryInput = matchedData<CommentQueryInput>(
      req,
      { locations: ['query'] },
    );

    const defaultQuery: PaginationAndSortingType<CommentSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const isPost: PostsDocument | null =
      await this.postsRepository.findPostById(req.params.postId);

    if (!isPost) {
      throw new NotFoundError(
        `Post with id ${req.params.id} not found`,
        'post',
      );
    }

    const findPost = await this.commentsQueryService.getCommentsByPostId(
      defaultQuery,
      isPost._id.toString(),
      userId,
    );

    res.send(findPost);
  }

  async getPostById(req: RequestWithParam<IdPostParamDto>, res: Response) {
    const existPost: PostOutputType | null =
      await this.postsQueryRepository.getPostById(req.params.id);

    if (!existPost) {
      throw new NotFoundError('Post is not found.', 'post');
    }

    res.send(existPost);
  }

  async getPostsByBlogId(req: Request, res: Response) {
    const blogId: string = req.params.blogId;

    const sanitizedQuery: PostQueryInput = matchedData<PostQueryInput>(req, {
      locations: ['query'],
    });

    const defaultQuery: PaginationAndSortingType<PostSortFieldEnum> =
      setDefaultSortAndPaginationIfNotExistHelper(sanitizedQuery);

    const existBlog: BlogOutputType | null =
      await this.blogsQueryRepository.getBlogById(blogId);

    if (!existBlog) {
      throw new NotFoundError('Blog not found for post', 'BlogId for Post');
    }

    const postsOutput = await this.postsQueryRepository.getPosts(
      defaultQuery,
      blogId,
    );

    res.send(postsOutput);
  }

  async removePost(req: RequestWithParam<IdPostParamDto>, res: Response) {
    await this.postsService.removePost(req.params.id);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async updatePost(
    req: RequestWithParamAndBody<IdPostParamDto, UpdatePostDto>,
    res: Response,
  ) {
    await this.postsService.updatePost(req.params.id, req.body);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }

  async updatePostLikeStatus(req: Request, res: Response) {
    const userId: string = req.userId as string;
    const postId: string = req.params.postId;
    const likeStatus = req.body.likeStatus as LikeStatusEnum;

    await this.likesService.updatePostLikeStatus(userId, postId, likeStatus);

    res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}
