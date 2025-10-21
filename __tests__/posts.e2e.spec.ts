import request, { Response } from 'supertest';
import { setupApp } from '../src/setup-app';
import { HTTP_STATUS } from '../src/enums/http-status';
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
import { RouterPath } from '../src/constants/router-path';
import { runDB, stopDB } from '../src/db/mango.db';
import { settings } from '../src/settings/settings';

const validateErrors: ErrorType[] = [
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
];

describe('test' + RouterPath.posts, () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(settings.DB_URL_TESTING);
    await clearDbE2eUtil(app);
  });

  afterAll(async () => {
    await clearDbE2eUtil(app);
    await stopDB();
  });

  it('should return status 200 and empty array', async () => {
    await request(app).get('/posts').expect(HTTP_STATUS.OK_200, []);
  });

  it('should return status 400 and array of errors when create post with invalid data', async () => {
    const response: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
    );

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining(validateErrors),
    );
  });

  it('should create post and return 201 with created post body', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body._id,
      responsePost.body,
    );
  });

  it('should return 401 Unauthorized when creating a post with invalid credentials', async () => {
    await createPostAndBlogE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);

    await getPostByIdE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100, {});
  });

  it('should return object post and return 200', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body._id,
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
      responsePost.body._id,
      responsePost.body.blogId,
    );

    await getPostByIdE2eUtil(app, HTTP_STATUS.OK_200, responsePost.body._id, {
      ...responsePost.body,
      ...exampleUpdatePost,
    });
  });

  it('should return 401 Unauthorized when updating a post with invalid credentials', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updatePostE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      responsePost.body._id,
      responsePost.body.blogId,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body._id,
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
      responsePost.body._id,
      responsePost.body.blogId,
    );

    expect(responseUpdate.body.errorsMessages).toEqual(
      expect.arrayContaining(validateErrors),
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body._id,
      responsePost.body,
    );
  });

  it('should return status 404 if trying to update non-existing post', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updatePostE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100, -100);

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body._id,
      responsePost.body,
    );
  });

  it('should return 401 Unauthorized when deleting a post with invalid credentials', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );
    +(await removePostE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      responsePost.body._id,
    ));

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body._id,
      responsePost.body,
    );
  });

  it('should remove existing post and return status 204', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removePostE2eUtil(
      app,
      HTTP_STATUS.NO_CONTENT_204,
      responsePost.body._id,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      responsePost.body._id,
      {},
    );
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
      responsePost.body._id,
      responsePost.body,
    );
  });
});
