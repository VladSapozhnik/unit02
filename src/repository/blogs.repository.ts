import { BlogType } from '../types/blog.type';
import { db } from '../db';
import { CreateBlogDto } from '../dto/blog/create-blog.dto';
import { UpdateBlogDto } from '../dto/blog/update-blog.dto';

export const blogsRepository = {
  async getBlogs(): Promise<BlogType[]> {
    return db.blogs.map((blog: BlogType) => blog);
  },

  async createBlog(body: CreateBlogDto, id: string): Promise<boolean> {
    const newBlog = { id, ...body };

    db.blogs.push(newBlog);

    return true;
  },

  getBlogById(id: string): BlogType | undefined {
    return db.blogs.find((blog: BlogType) => blog.id === id);
  },

  async updateBlog(id: string, body: UpdateBlogDto): Promise<boolean> {
    const existBlog: BlogType | undefined = this.getBlogById(id);

    if (existBlog) {
      Object.assign(existBlog, body);
      return true;
    } else {
      return false;
    }
  },

  async removeBlogById(id: string): Promise<boolean> {
    const existBlog: BlogType | undefined = await this.getBlogById(id);

    if (!existBlog) {
      return false;
    }

    db.blogs = db.blogs.filter((blog: BlogType) => blog.id !== id);
    return true;
  },
};
