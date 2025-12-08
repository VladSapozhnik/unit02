import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/create-post.dto';
import { BlogType } from '../../blogs/types/blog.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import { NotFoundError } from '../../../core/errors/repository-not-found.error';
import { createdAtHelper } from '../../../core/helpers/created-at.helper';
import { BadRequestError } from '../../../core/errors/bad-request.error';
import { PostsRepository } from '../repositories/posts.repository';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { inject, injectable } from 'inversify';

@injectable()
export class PostsService {
  constructor(
    @inject(PostsRepository) private readonly postsRepository: PostsRepository,
    @inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}
  async createPost(body: CreatePostDto): Promise<string> {
    const existBlog: BlogType | null = await this.blogsRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      throw new BadRequestError("Blog doesn't exist", 'blogId For Post');
    }

    const postBody: PostType = {
      ...body,
      blogName: existBlog.name,
      createdAt: createdAtHelper(),
    };

    const postId: string = await this.postsRepository.createPost(postBody);

    if (!postId) {
      throw new BadRequestError('Failed to create Post', 'post');
    }

    return postId;
  }

  async createPostForBlog(body: CreatePostDto): Promise<string> {
    const existBlog: BlogType | null = await this.blogsRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      throw new NotFoundError('Blog not found for post', 'BlogId for Post');
    }

    const postBody: PostType = {
      ...body,
      blogName: existBlog.name,
      createdAt: createdAtHelper(),
    };

    const postId: string = await this.postsRepository.createPost(postBody);

    if (!postId) {
      throw new BadRequestError('Failed to create Post', 'post');
    }

    return postId;
  }

  async updatePost(id: string, body: UpdatePostDto) {
    const existBlog: BlogType | null = await this.blogsRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      throw new NotFoundError('BlogId not found for post', 'BlogId for Post');
    }

    const updatedBody = { ...body, blogName: existBlog.name };

    const isUpdate: boolean = await this.postsRepository.updatePost(
      id,
      updatedBody,
    );

    if (!isUpdate) {
      throw new NotFoundError('Failed to update Post', 'post');
    }
  }

  async removePost(id: string) {
    const isRemove: boolean = await this.postsRepository.removePost(id);

    if (!isRemove) {
      throw new NotFoundError('Failed to remove Post', 'post');
    }
  }
}

// export const postsService = {
//   async createPost(body: CreatePostDto): Promise<string> {
//     const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
//       body.blogId,
//     );
//
//     if (!existBlog) {
//       throw new BadRequestError("Blog doesn't exist", 'blogId For Post');
//     }
//
//     const postBody: PostType = {
//       ...body,
//       blogName: existBlog.name,
//       createdAt: createdAtHelper(),
//     };
//
//     const postId: string = await postsRepository.createPost(postBody);
//
//     if (!postId) {
//       throw new BadRequestError('Failed to create Post', 'post');
//     }
//
//     return postId;
//   },
//
//   async createPostForBlog(body: CreatePostDto): Promise<string> {
//     const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
//       body.blogId,
//     );
//
//     if (!existBlog) {
//       throw new NotFoundError('Blog not found for post', 'BlogId for Post');
//     }
//
//     const postBody: PostType = {
//       ...body,
//       blogName: existBlog.name,
//       createdAt: createdAtHelper(),
//     };
//
//     const postId: string = await postsRepository.createPost(postBody);
//
//     if (!postId) {
//       throw new BadRequestError('Failed to create Post', 'post');
//     }
//
//     return postId;
//   },
//
//   async updatePost(id: string, body: UpdatePostDto) {
//     const existBlog: BlogType | null = await blogsQueryRepository.getBlogById(
//       body.blogId,
//     );
//
//     if (!existBlog) {
//       throw new NotFoundError('BlogId not found for post', 'BlogId for Post');
//     }
//
//     const updatedBody = { ...body, blogName: existBlog.name };
//
//     const isUpdate: boolean = await postsRepository.updatePost(id, updatedBody);
//
//     if (!isUpdate) {
//       throw new NotFoundError('Failed to update Post', 'post');
//     }
//   },
//
//   async removePost(id: string) {
//     const isRemove: boolean = await postsRepository.removePost(id);
//
//     if (!isRemove) {
//       throw new NotFoundError('Failed to remove Post', 'post');
//     }
//   },
// };
