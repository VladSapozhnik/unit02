import { db } from '../db';
import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/post/create-post.dto';
import { blogsRepository } from './blogs.repository';
import { BlogType } from '../types/blog.type';
import { UpdatePostDto } from '../dto/post/update-post.dto';

export const postsRepository = {
  getAllPosts: (): PostType[] => {
    return db.posts.map((post: PostType) => post);
  },

  createPost: (body: CreatePostDto, id: string): boolean => {
    const existBlog: BlogType | undefined = blogsRepository.getBlogById(
      body.blogId,
    );

    if (!existBlog) {
      return false;
    }

    const newPost: PostType = { id, ...body, blogName: existBlog.name };
    db.posts.push(newPost);

    return true;
  },

  getPostById(id: string): PostType | undefined {
    return db.posts.find((blog: PostType) => blog.id === id);
  },

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const existPost: PostType | undefined =
      await postsRepository.getPostById(id);

    if (existPost) {
      Object.assign(existPost, body);
      return true;
    } else {
      return false;
    }
  },
  async removePost(id: string): Promise<boolean> {
    const existPost: PostType | undefined =
      await postsRepository.getPostById(id);

    if (existPost) {
      db.posts = db.posts.filter((post: PostType) => post.id !== id);
      return true;
    } else {
      return false;
    }
  },
};
