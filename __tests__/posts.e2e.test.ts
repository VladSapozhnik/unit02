import request from "supertest";
import {app} from "../src/setting";
import {HTTP_STATUS} from "../src/enums/http-status";
import {CreateBlogDto} from "../src/dto/blog/create-blog.dto";
import {CreatePostDto} from "../src/dto/post/create-post.dto";
import {ResponsePostDto} from "../src/dto/post/response-post.dto";
import {ResponseBlogDto} from "../src/dto/blog/response-blog.dto";
import { type ErrorType } from "../src/middleware/input-validation.middleware"
import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../src/middleware/super-admin-guard.middleware";

export const exampleCreateBlog: CreateBlogDto = {
    "name": "Name",
    "description": "Description",
    "websiteUrl": "https://9.bnkqAJalm18cU8rsHdEqoUmUT2xh8Eb0h2a35xQiRR-UslhXAolExHnl.wKoraGI.HDtXk1.hZnv_1p4WqL5_Quj6f"
}

const exampleCreatePost: CreatePostDto = {
    "title": "Create Post",
    "shortDescription": "Create description string",
    "content": "Content example string",
    "blogId": "1"
}

const exampleNonCreatePost: CreatePostDto = {
    "title": "",
    "shortDescription": "",
    "content": "",
    "blogId": ""
}

const exampleUpdatePost = {
    "title": "string",
    "shortDescription": "string",
    "content": "string",
    "blogId": "1"
}

const exampleNonUpdatePost: CreatePostDto = {
    "title": "",
    "shortDescription": "",
    "content": "",
    "blogId": ""
}

const validateErrors: ErrorType[] = [
    { message: expect.any(String), field: expect.any(String) },
    { message: expect.any(String), field: expect.any(String) },
    { message: expect.any(String), field: expect.any(String) },
    { message: expect.any(String), field: expect.any(String) },
]

describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HTTP_STATUS.NO_CONTENT_204);
    })

    it ('should return status 200 and empty array', async () => {
        await request(app).get('/posts').expect(HTTP_STATUS.OK_200, [])
    })


    it('should return status 400 and array of errors when create post with invalid data', async () => {
        const response = await request(app).post('/posts/').auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleNonCreatePost).expect(HTTP_STATUS.BAD_REQUEST_400);

        expect(response.body.errorsMessages).toEqual(expect.arrayContaining(validateErrors));
    })

    let createPostBody: ResponsePostDto;
    it ('should create post and return 201 with created post body', async () => {
        const responseBlog = await request(app).post('/blogs').auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleCreateBlog).expect(HTTP_STATUS.CREATED_201);
        // console.log(responseBlog.body.id);
        const responsePost = await request(app).post('/posts').auth(ADMIN_USERNAME, ADMIN_PASSWORD).send({...exampleCreatePost, blogId: responseBlog.body.id}).expect(HTTP_STATUS.CREATED_201);

        createPostBody = responsePost.body;

        expect(createPostBody).toEqual({id: expect.any(String), ...exampleCreatePost, blogId: responseBlog.body.id, blogName: expect.any(String)});
    })

    it('should return object post and return 200', async () => {
        await request(app).get('/posts/' + createPostBody.id).expect(HTTP_STATUS.OK_200, createPostBody)
    });

    it('should return status 404 for non-existing post', async () => {
        await request(app).get('/posts/' + -100).expect(HTTP_STATUS.NOT_FOUND_404);
    })


    let createBlogBody: ResponseBlogDto;
    it('should update existing post and return status 204', async () => {
        const responseBlog = await request(app).post('/blogs').auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleCreateBlog).expect(HTTP_STATUS.CREATED_201);

        await request(app).put('/posts/' + createPostBody.id).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send({...exampleUpdatePost, blogId: responseBlog.body.id}).expect(HTTP_STATUS.NO_CONTENT_204);

        const responseUpdatePost = await request(app).get('/posts/' + createPostBody.id).expect(HTTP_STATUS.OK_200);

        createBlogBody = responseBlog.body;
        createPostBody = responseUpdatePost.body;

        expect(createPostBody).toEqual({id: expect.any(String), ...exampleUpdatePost, blogId: responseBlog.body.id, blogName: expect.any(String)});
    })

    it('should return status 400 and array of errors when update post with invalid data', async () => {
        const response = await request(app).put('/posts/' + createBlogBody.id).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleNonUpdatePost).expect(HTTP_STATUS.BAD_REQUEST_400);

        expect(response.body.errorsMessages).toEqual(expect.arrayContaining(validateErrors));
    })

    it('should return status 404 if trying to update non-existing post', async () => {
        await request(app).put('/posts/' + -100).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send({...exampleUpdatePost, blogId: createBlogBody.id}).expect(HTTP_STATUS.NOT_FOUND_404);
    })

    it('should remove existing post and return status 204', async () => {
        await request(app).delete('/posts/' + createPostBody.id).auth(ADMIN_USERNAME, ADMIN_PASSWORD).expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app).get('/posts/' + createPostBody.id).expect(HTTP_STATUS.NOT_FOUND_404);
    })

    it('should return status 404 if trying to delete non-existing blog', async () => {
        await request(app).delete('/posts/' + -100).auth(ADMIN_USERNAME, ADMIN_PASSWORD).expect(HTTP_STATUS.NOT_FOUND_404);
    })
})