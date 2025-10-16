import request from "supertest";
import {app} from "../src/setting";
import {HTTP_STATUS} from "../src/enums/http-status";
import {CreateBlogDto} from "../src/dto/blog/create-blog.dto";
import {ResponseBlogDto} from "../src/dto/blog/response-blog.dto";
import {UpdateBlogDto} from "../src/dto/blog/update-blog.dto";
import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../src/middleware/super-admin-guard.middleware";
import {type ErrorType} from "../src/types/error.type";
import {RouterPath} from "../src/constants/router-path";
import BlogsTestManager from "./managers/blogs.test.manager";

const exampleCreateBlog: CreateBlogDto = {
    "name": "Name",
    "description": "Description",
    "websiteUrl": "https://9.bnkqAJalm18cU8rsHdEqoUmUT2xh8Eb0h2a35xQiRR-UslhXAolExHnl.wKoraGI.HDtXk1.hZnv_1p4WqL5_Quj6f"
}

const exampleNonCreateBlog: CreateBlogDto = {
    "name": "",
    "description": "",
    "websiteUrl": ""
}

const exampleUpdateBlog: UpdateBlogDto = {
    "name": "New Blog",
    "description": "New description",
    "websiteUrl": "https://www.google.com/"
}

const exampleNonUpdateBlog: UpdateBlogDto = {
    "name": "",
    "description": "",
    "websiteUrl": ""
}

const validateErrors: ErrorType[] = [
    { message: expect.any(String), field: expect.any(String) },
    { message: expect.any(String), field: expect.any(String) },
    { message: expect.any(String), field: expect.any(String) },
]

const nonAuth = {
    admin: 'no-auth',
    password: 'no-auth'
}

describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete(RouterPath.__tests__).expect(HTTP_STATUS.NO_CONTENT_204);
    })

    it ('should return status 200 and empty array', async () => {
        await request(app).get(RouterPath.blogs).expect(200, [])
    })

    it('should return status 400 and array of errors when create blog with invalid data', async () => {
        const response = await request(app).post(RouterPath.blogs).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleNonCreateBlog).expect(HTTP_STATUS.BAD_REQUEST_400);

        expect(response.body.errorsMessages).toEqual(expect.arrayContaining(validateErrors));
    })

    let createBlogBody: ResponseBlogDto;
    it ('should create blog and return 201 with created blog body', async () => {
        // const response = await request(app).post(RouterPath.blogs).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleCreateBlog).expect(HTTP_STATUS.CREATED_201)

        // createBlogBody = await response.body;
        createBlogBody = await BlogsTestManager.createBlog(exampleCreateBlog)

        expect(createBlogBody).toEqual({id: expect.any(String), ...exampleCreateBlog});
    })

    it ('should return 401 Unauthorized when creating a blog with invalid credentials', async () => {
        await request(app).post(RouterPath.blogs).auth(nonAuth.admin, nonAuth.password).send(exampleCreateBlog).expect(HTTP_STATUS.UNAUTHORIZED_401)
    })

    it('should return object blog and return 200', async () => {
        await request(app).get(RouterPath.blogs + createBlogBody.id).expect(200,  createBlogBody)
    });

    it ('should return status 404 for not-existing blog', async () => {
        await request(app).get(RouterPath.blogs + -100).expect(404)
    })

    it('should return status 400 and array of errors when update blog with invalid data', async () => {
        const response = await request(app).put(RouterPath.blogs + createBlogBody.id).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleNonUpdateBlog).expect(HTTP_STATUS.BAD_REQUEST_400);

        expect(response.body.errorsMessages).toEqual(expect.arrayContaining(validateErrors));
    })

    it('should return 401 Unauthorized when updating a blog with invalid credentials', async () => {
        await request(app).put(RouterPath.blogs + createBlogBody.id).auth(nonAuth.admin, nonAuth.password).send(exampleUpdateBlog).expect(HTTP_STATUS.UNAUTHORIZED_401);
    })

    it ('should update existing blog and return status 204', async () => {
        await request(app).put(RouterPath.blogs + createBlogBody.id).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleUpdateBlog).expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app).get(RouterPath.blogs + createBlogBody.id).expect(HTTP_STATUS.OK_200, {id: createBlogBody.id, ...exampleUpdateBlog});

    })

    it ('should return status 404 if trying to update non-existing blog', async () => {
        await request(app).put(RouterPath.blogs + -100).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(exampleUpdateBlog).expect(HTTP_STATUS.NOT_FOUND_404);
    })

    it ('should return 401 Unauthorized when deleting a blog with invalid credentials', async () => {
        await request(app).delete(RouterPath.blogs + createBlogBody.id).auth(nonAuth.admin, nonAuth.password).expect(HTTP_STATUS.UNAUTHORIZED_401);
    })

    it ('should remove existing blog and return status 204', async () => {
       await request(app).delete(RouterPath.blogs + createBlogBody.id).auth(ADMIN_USERNAME, ADMIN_PASSWORD).expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app).get(RouterPath.blogs).expect(HTTP_STATUS.OK_200, []);
    })

    it ('should return status 404 if trying to delete non-existing blog', async () => {
        await request(app).delete(RouterPath.blogs + -100).auth(ADMIN_USERNAME, ADMIN_PASSWORD).expect(HTTP_STATUS.NOT_FOUND_404);
    })
})