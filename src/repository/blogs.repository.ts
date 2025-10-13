import {ResponseBlogDto} from "../dto/blog/response-blog.dto";
import {db} from "../db";
import {CreateBlogDto} from "../dto/blog/create-blog.dto";
import {UpdateBlogDto} from "../dto/blog/update-blog.dto";


export const blogsRepository = {
    getBlogs (): ResponseBlogDto[] {
        return db.blogs.map((blog: ResponseBlogDto) => blog)
    },

    createBlog (body: CreateBlogDto, id: string): boolean {
        const newBlog = {id, ...body}

        db.blogs.push(newBlog);

        return true;
    },

    getBlogById(id: string): ResponseBlogDto | undefined {
        return db.blogs.find((blog: ResponseBlogDto) => blog.id === id)
    },

    updateBlog (id: string, body: UpdateBlogDto): boolean {
        const blog: ResponseBlogDto | undefined  = this.getBlogById(id);

        if (blog) {
            Object.assign(blog, body);
            return true;
        } else {
            return false;
        }
    },

    removeBlogById (id: string): boolean {
        const blog: ResponseBlogDto | undefined  = this.getBlogById(id);

        if (blog) {
            db.blogs = db.blogs.filter((blog: ResponseBlogDto) => blog.id === id);
            return true;
        } else {
            return false;
        }
    }
}