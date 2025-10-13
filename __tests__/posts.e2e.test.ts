import request from "supertest";
import {app} from "../src/setting";
import {HTTP_STATUS} from "../src/enums/http-status";
import {CreatePostDto} from "../src/dto/post/create-post.dto";

const exampleCreatePost: CreatePostDto = {
    "title": "Create Post",
    "shortDescription": "Create description string",
    "content": "Content example string",
    "blogId": "1"
}

const exampleUpdatePost = {
    "title": "string",
    "shortDescription": "string",
    "content": "string",
    "blogId": "1"
}

describe('/posts', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(HTTP_STATUS.NO_CONTENT_204);
    })

    it ('should return status 200 and empty array', async () => {
        await request(app).get('/posts').expect(200, [])
    })
})