import request, { Response } from 'supertest';
import { setupApp } from '../src/setup-app';
import { HTTP_STATUS } from '../src/enums/http-status';
import { CreatePostDto } from '../src/dto/post/create-post.dto';
import { type ErrorType } from '../src/types/error.type';
import express from 'express';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';
import { createPostAndBlogE2eUtil } from './utils/posts/create-post-and-blog-e2e.util';
import { getPostByIdE2eUtil } from './utils/posts/get-post-by-id.e2e.util';
import { removePostE2eUtil } from './utils/posts/remove-post.e2e.util';
import {
  exampleUpdatePost,
  updatePostE2eUtil,
} from './utils/posts/update-post.e2e.util';

const validateErrors: ErrorType[] = [
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
];

describe('/posts', () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await clearDbE2eUtil(app);
  });

  it('should return status 200 and empty array', async () => {
    await request(app).get('/posts').expect(HTTP_STATUS.OK_200, []);
  });

  it('should return status 400 and array of errors when create post with invalid data', async () => {
    // const response = await request(app)
    //   .post(RouterPath.posts)
    //   .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
    //   .send(exampleNonCreatePost)
    //   .expect(HTTP_STATUS.BAD_REQUEST_400);

    const response: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
    );

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining(validateErrors),
    );
  });

  // let createPostBody: ResponsePostDto;
  it('should create post and return 201 with created post body', async () => {
    // const responseBlog: Response = await createBlogE2e(
    //   app,
    //   HTTP_STATUS.CREATED_201,
    // );

    // const responsePost = await request(app)
    //   .post(RouterPath.posts)
    //   .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
    //   .send({ ...exampleCreatePost, blogId: responseBlog.body.id })
    //   .expect(HTTP_STATUS.CREATED_201);
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );

    // createPostBody = responsePost.body;

    // expect(responsePost.body).toEqual({
    //   id: expect.any(String),
    //   ...exampleCreatePost,
    //   blogId: responseBlog.body.id,
    //   blogName: expect.any(String),
    // });
  });

  it('should return 401 Unauthorized when creating a post with invalid credentials', async () => {
    await createPostAndBlogE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);

    await getPostByIdE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100, {});

    // await request(app)
    //   .post(RouterPath.posts)
    //   .auth(nonAuth.admin, nonAuth.password)
    //   .send({ ...exampleCreatePost })
    //   .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return object post and return 200', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    // await request(app)
    //   .get(RouterPath.posts + createPostBody.id)
    //   .expect(HTTP_STATUS.OK_200, createPostBody);

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );
  });

  it('should return status 404 for non-existing post', async () => {
    await createPostAndBlogE2eUtil(app, HTTP_STATUS.CREATED_201);

    await getPostByIdE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100, {});
  });

  it('should update existing post and return status 204', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updatePostE2eUtil(
      app,
      HTTP_STATUS.NO_CONTENT_204,
      responsePost.body.id,
      responsePost.body.blogId,
    );

    // await request(app)
    //   .put(RouterPath.posts + createPostBody.id)
    //   .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
    //   .send({ ...exampleUpdatePost, blogId: responseBlog.body.id })
    //   .expect(HTTP_STATUS.NO_CONTENT_204);

    // const responseUpdatePost = await request(app)
    //   .get(RouterPath.posts + createPostBody.id)
    //   .expect(HTTP_STATUS.OK_200);

    // createBlogBody = responseBlog.body;
    // createPostBody = responseUpdatePost.body;

    const updatedPost = {
      ...responsePost.body,
      title: exampleUpdatePost.title,
      shortDescription: exampleUpdatePost.shortDescription,
      content: exampleUpdatePost.content,
    };

    // await getPostByIdE2eUtil(
    //   app,
    //   HTTP_STATUS.OK_200,
    //   responsePost.body.id,
    //   updatedPost,
    // );

    await request(app).get('/posts/').expect(200, [updatedPost]);

    // console.log(responseUpdatePost);

    // expect(createPostBody).toEqual({
    //   id: expect.any(String),
    //   ...exampleUpdatePost,
    //   blogId: responseBlog.body.id,
    //   blogName: expect.any(String),
    // });
  });

  it('should return 401 Unauthorized when updating a post with invalid credentials', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updatePostE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      responsePost.body.id,
      responsePost.body.blogId,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );
  });

  it('should return status 400 and array of errors when update post with invalid data', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    const responseUpdate: Response = await updatePostE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
      responsePost.body.id,
      responsePost.body.blogId,
    );

    // const response = await request(app)
    //   .put(RouterPath.posts + createBlogBody.id)
    //   .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
    //   .send(exampleNonUpdatePost)
    //   .expect(HTTP_STATUS.BAD_REQUEST_400);

    expect(responseUpdate.body.errorsMessages).toEqual(
      expect.arrayContaining(validateErrors),
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );
  });

  it('should return status 404 if trying to update non-existing post', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    // await request(app)
    //   .put(RouterPath.posts + -100)
    //   .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
    //   .send({ ...exampleUpdatePost, blogId: createBlogBody.id })
    //   .expect(HTTP_STATUS.NOT_FOUND_404);
    await updatePostE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100, -100);

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );
  });

  ///////////////////////////////////////////////////top

  it('should return 401 Unauthorized when deleting a post with invalid credentials', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removePostE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      responsePost.body.id,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );

    // await request(app)
    //   .delete(RouterPath.posts + createPostBody.id)
    //   .auth(nonAuth.admin, nonAuth.password)
    //   .expect(HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should remove existing post and return status 204', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removePostE2eUtil(
      app,
      HTTP_STATUS.NO_CONTENT_204,
      responsePost.body.id,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      responsePost.body.id,
      {},
    );

    // await request(app)
    //   .delete(RouterPath.posts + createPostBody.id)
    //   .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
    //   .expect(HTTP_STATUS.NO_CONTENT_204);
    //
    // await request(app)
    //   .get(RouterPath.posts + createPostBody.id)
    //   .expect(HTTP_STATUS.NOT_FOUND_404);
  });

  it('should return status 404 if trying to delete non-existing blog', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removePostE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100);

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );
    // await request(app)
    //   .delete(RouterPath.posts + -100)
    //   .auth(ADMIN_USERNAME, ADMIN_PASSWORD)
    //   .expect(HTTP_STATUS.NOT_FOUND_404);
  });
});
