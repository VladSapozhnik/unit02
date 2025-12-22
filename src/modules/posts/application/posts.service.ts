import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { PostsRepository } from '../repositories/posts.repository';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { BlogDocument } from '../../blogs/entities/blog.entity';
import { PostModel, PostsDocument } from '../entities/post.entity';

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}
  async createPost(body: CreatePostDto): Promise<string> {
    const existBlog: BlogDocument | null =
      await this.blogsRepository.getBlogById(body.blogId.toString());

    if (!existBlog) {
      throw new BadRequestError("Blog doesn't exist", 'blogId For Post');
    }

    const newPost = new PostModel({
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: new Types.ObjectId(body.blogId),
      blogName: existBlog.name,
    });

    // const postBody: PostDBType = {
    //   _id: new Types.ObjectId(),
    //   ...body,
    //   blogId: new Types.ObjectId(body.blogId),
    //   blogName: existBlog.name,
    //   createdAt: new Date(),
    // };

    const postId: string = await this.postsRepository.createPost(newPost);

    if (!postId) {
      throw new BadRequestError('Failed to create Post', 'post');
    }

    return postId;
  }

  async createPostForBlog(body: CreatePostDto): Promise<string> {
    const existBlog: BlogDocument | null =
      await this.blogsRepository.getBlogById(body.blogId.toString());

    if (!existBlog) {
      throw new NotFoundError('Blog not found for post', 'BlogId for Post');
    }

    // const postBody: PostDBType = {
    //   _id: new Types.ObjectId(),
    //   ...body,
    //   blogId: new Types.ObjectId(body.blogId),
    //   blogName: existBlog.name,
    //   createdAt: new Date(),
    // };

    const newPost = new PostModel({
      title: body.title,
      shortDescription: body.shortDescription,
      content: body.content,
      blogId: new Types.ObjectId(body.blogId),
      blogName: existBlog.name,
    });

    const postId: string = await this.postsRepository.createPost(newPost);

    if (!postId) {
      throw new BadRequestError('Failed to create Post', 'post');
    }

    return postId;
  }

  async updatePost(id: string, body: UpdatePostDto) {
    const existBlog: BlogDocument | null =
      await this.blogsRepository.getBlogById(body.blogId.toString());

    if (!existBlog) {
      throw new NotFoundError('BlogId not found for post', 'BlogId for Post');
    }

    const existPost: PostsDocument | null =
      await this.postsRepository.findPostById(id.toString());

    if (!existPost) {
      throw new NotFoundError('Failed to update Post', 'post');
    }

    existPost.title = body.title;
    existPost.shortDescription = body.shortDescription;
    existPost.content = body.content;
    existPost.blogName = existBlog.name;

    await this.postsRepository.updatePost(existPost);
  }

  async removePost(id: string) {
    const existPost: PostsDocument | null =
      await this.postsRepository.findPostById(id.toString());

    if (!existPost) {
      throw new NotFoundError('Failed to remove Post', 'post');
    }

    await this.postsRepository.removePost(existPost);
  }
}
