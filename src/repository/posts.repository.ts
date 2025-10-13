import {db} from "../db";
import {ResponsePostDto} from "../dto/post/response-post.dto";
import {CreatePostDto} from "../dto/post/create-post.dto";
import {blogsRepository} from "./blogs.repository";
import {ResponseBlogDto} from "../dto/blog/response-blog.dto";
import {UpdatePostDto} from "../dto/post/update-post.dto";

export const postsRepository = {
    getAllPosts: (): ResponsePostDto[] => {
        return db.posts.map((post: ResponsePostDto) => post)
    },

    createPost: (body: CreatePostDto, id: string): boolean => {
        const findBlog: ResponseBlogDto | undefined  = blogsRepository.getBlogById(body.blogId);

        if (!findBlog) {
            return false;
        }

        const newPost: ResponsePostDto = {id , ...body, blogName: findBlog.name}
        db.posts.push(newPost)

        return true;
    },

    getPostById(id: string): ResponsePostDto | undefined {
        return db.posts.find((blog: ResponsePostDto) => blog.id === id)
    },

    updatePost(id: string, body: UpdatePostDto): boolean {
        const existPost: ResponsePostDto | undefined = postsRepository.getPostById(id);

        if (existPost) {
            Object.assign(existPost, body)
            return true;
        } else {
            return false;
        }
    },
    removePost(id: string): boolean {
        const existPost: ResponsePostDto | undefined = postsRepository.getPostById(id);

        if (existPost) {
            db.posts = db.posts.filter((post: ResponsePostDto) => post.id !== id)
            return true
        } else {
            return false;
        }
    }
}