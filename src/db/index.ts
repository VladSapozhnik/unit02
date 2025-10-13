import {ResponseBlogDto} from "../dto/blog/response-blog.dto";
import {ResponsePostDto} from "../dto/post/response-post.dto";

export const db: { blogs: ResponseBlogDto[], posts: ResponsePostDto[] } = {
    blogs: [
        {
            "id": "1",
            "name": "test blog",
            "description": "test description",
            "websiteUrl": "test websiteUrl",
        }
    ],
    posts: [
        {
            "id": "1",
            "title": "test title posts",
            "shortDescription": "test description",
            "content": "test content",
            "blogId": "1",
            "blogName": "test post))"
        }
    ]
}