import request from "supertest";
import {app} from "../../src/setting";
import {RouterPath} from "../../src/constants/router-path";
import {ADMIN_PASSWORD, ADMIN_USERNAME} from "../../src/middleware/super-admin-guard.middleware";
import {HTTP_STATUS} from "../../src/enums/http-status";
import {CreateBlogDto} from "../../src/dto/blog/create-blog.dto";
import {ResponseBlogDto} from "../../src/dto/blog/response-blog.dto";


export const BlogsTestManager = {
    async createBlog(body: CreateBlogDto): Promise<ResponseBlogDto> {
        const response = await request(app).post(RouterPath.blogs).auth(ADMIN_USERNAME, ADMIN_PASSWORD).send(body).expect(HTTP_STATUS.CREATED_201);

        return response.body;
    }
}