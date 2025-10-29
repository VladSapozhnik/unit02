import request, { Response } from 'supertest';
import { setupApp } from '../src/setup-app';
import { HTTP_STATUS } from '../src/core/enums/http-status.enum';
import { type ErrorType } from '../src/core/types/error.type';
import express from 'express';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';
import { createPostAndBlogE2eUtil } from './utils/posts/create-post-and-blog-e2e.util';
import { getPostByIdE2eUtil } from './utils/posts/get-post-by-id.e2e.util';
import { removePostE2eUtil } from './utils/posts/remove-post.e2e.util';
import {
  exampleUpdatePost,
  updatePostE2eUtil,
} from './utils/posts/update-post.e2e.util';
import { RouterPath } from '../src/core/constants/router-path';
import { runDB, stopDB } from '../src/core/db/mango.db';
import { settings } from '../src/core/settings/settings';
import { ObjectIdValid } from './blogs.e2e.spec';

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
    await runDB(settings.MONGO_URI_TESTING);
    await clearDbE2eUtil(app);
  });

  afterAll(async () => {
    await clearDbE2eUtil(app);
    await stopDB();
  });

  it('should return status 200 and empty array', async () => {
    await request(app).get('/posts').expect(HTTP_STATUS.OK_200, {
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('should return status 400 and array of errors when create dto with invalid data', async () => {
    const response: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
    );

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining(validateErrors),
    );
  });

  it('should create dto and return 201 with created dto body', async () => {
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
  });

  it('should return 401 Unauthorized when creating a dto with invalid credentials', async () => {
    await createPostAndBlogE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);

    await getPostByIdE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, ObjectIdValid, {});
  });

  it('should return object dto and return 200', async () => {
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
  });

  it('should return status 404 for non-existing dto', async () => {
    await createPostAndBlogE2eUtil(app, HTTP_STATUS.CREATED_201);

    await getPostByIdE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, ObjectIdValid, {});
  });

  it('should update existing dto and return status 204', async () => {
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

    await getPostByIdE2eUtil(app, HTTP_STATUS.OK_200, responsePost.body.id, {
      ...responsePost.body,
      ...exampleUpdatePost,
    });
  });

  it('should return 401 Unauthorized when updating a dto with invalid credentials', async () => {
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

  it('should return status 400 and array of errors when update dto with invalid data', async () => {
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

  it('should return status 404 if trying to update non-existing dto', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updatePostE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      responsePost.body.id,
      ObjectIdValid,
    );

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );
  });

  it('should return 401 Unauthorized when deleting a dto with invalid credentials', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );
    +(await removePostE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      responsePost.body.id,
    ));

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );
  });

  it('should remove existing dto and return status 204', async () => {
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
  });

  it('should return status 404 if trying to delete non-existing dto', async () => {
    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removePostE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, ObjectIdValid);

    await getPostByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responsePost.body.id,
      responsePost.body,
    );
  });
});
