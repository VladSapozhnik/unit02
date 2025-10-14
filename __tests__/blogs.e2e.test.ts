import request from "supertest";
import {app} from "../src/setting";
import {HTTP_STATUS} from "../src/enums/http-status";
import {CreateBlogDto} from "../src/dto/blog/create-blog.dto";
import {ResponseBlogDto} from "../src/dto/blog/response-blog.dto";

const exampleCreateBlog: CreateBlogDto = {
    "name": "Name",
    "description": "Description",
    "websiteUrl": "https://9.bnkqAJalm18cU8rsHdEqoUmUT2xh8Eb0h2a35xQiRR-UslhXAolExHnl.wKoraGI.HDtXk1.hZnv_1p4WqL5_Quj6f"
}

const exampleUpdateBlog = {
    "name": "New Blog",
    "description": "New description",
    "websiteUrl": "https://zR7XcOZQX7T0RjeEzdCfMvXGqVNwS1CUbeY._JVMK4vpxapszIInxGPWIO4w-hJu60-Cr7hX9VORkBF7sIRNDEqkDB0d"
}

describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HTTP_STATUS.NO_CONTENT_204);
    })

    it ('should return status 200 and empty array', async () => {
        await request(app).get('/blogs').expect(200, [])
    })

    let createBlogBody: ResponseBlogDto;
    it ('should create blog and return 201 with created blog body', async () => {
        const response = await request(app).post('/blogs').send(exampleCreateBlog).expect(HTTP_STATUS.CREATED_201)

        createBlogBody = await response.body;

        expect(createBlogBody).toEqual({id: expect.any(String), ...exampleCreateBlog});
    })

    it('should return object blog and return 200', async () => {
        await request(app).get('/blogs/' + createBlogBody.id).expect(200,  createBlogBody)
    });

    it ('should return status 404 for not-existing blog', async () => {
        await request(app).get('/blogs/' + -100).expect(404)
    })

    it ('should update existing blog and return status 204', async () => {
        await request(app).put('/blogs/' + createBlogBody.id).send(exampleUpdateBlog).expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app).get(`/blogs/${createBlogBody.id}`).expect(HTTP_STATUS.OK_200, {id: createBlogBody.id, ...exampleUpdateBlog});

    })

    it ('should return status 404 if trying to update non-existing blog', async () => {
        await request(app).put('/blogs/' + -100).send(exampleUpdateBlog).expect(HTTP_STATUS.NOT_FOUND_404);
    })

    it ('should remove existing blog and return status 204', async () => {
       await request(app).delete('/blogs/' + createBlogBody.id).expect(HTTP_STATUS.NO_CONTENT_204);

        await request(app).get('/blogs').expect(HTTP_STATUS.OK_200, []);
    })

    it ('should return status 404 if trying to delete non-existing blog', async () => {
        await request(app).delete('/blogs/' + -100).expect(HTTP_STATUS.NOT_FOUND_404);
    })
})