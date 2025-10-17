import request, { type Response } from 'supertest';
import { setupApp } from '../src/setup-app';
import { HTTP_STATUS } from '../src/enums/http-status';
import { type ErrorType } from '../src/types/error.type';
import { RouterPath } from '../src/constants/router-path';
import {
  createBlogE2eUtil,
  exampleCreateBlog,
} from './utils/blogs/create-blog.e2e.util';
import express from 'express';
import {
  exampleUpdateBlog,
  updateBlogE2eUtil,
} from './utils/blogs/update-blog.e2e.util';
import { removeBlogE2eUtil } from './utils/blogs/remove-blog.e2e.util';
import { getBlogByIdE2eUtil } from './utils/blogs/get-blog-by-id.e2e.util';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';

const validateErrors: ErrorType[] = [
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
];

describe('/videos', () => {
  const app = express();

  setupApp(app);

  beforeEach(async () => {
    await clearDbE2eUtil(app);
  });

  it('should return status 200 and empty array', async () => {
    await request(app).get(RouterPath.blogs).expect(200, []);
  });

  it('should return status 400 and array of errors when create blog with invalid data', async () => {
    const response = await createBlogE2eUtil(app, HTTP_STATUS.BAD_REQUEST_400);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining(validateErrors),
    );
  });

  it('should create blog and return 201 with created blog body', async () => {
    const response = await createBlogE2eUtil(app, HTTP_STATUS.CREATED_201);

    expect(response.body).toEqual({
      id: expect.any(String),
      ...exampleCreateBlog,
    });
  });

  it('should return 401 Unauthorized when creating a blog with invalid credentials', async () => {
    await createBlogE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return object blog and return 200', async () => {
    const response: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      response.body.id,
      response.body,
    );
  });

  it('should return status 404 for not-existing blog', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await getBlogByIdE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100);

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });

  it('should return status 400 and array of errors when update blog with invalid data', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    const invalidUpdateResponse: Response = await updateBlogE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
      createBlogResponse.body.id,
    );

    expect(invalidUpdateResponse.body.errorsMessages).toEqual(
      expect.arrayContaining(validateErrors),
    );

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });

  it('should return 401 Unauthorized when updating a blog with invalid credentials', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updateBlogE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      createBlogResponse.body.id,
    );

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });

  it('should update existing blog and return status 204', async () => {
    const responseCreateBlog: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updateBlogE2eUtil(
      app,
      HTTP_STATUS.NO_CONTENT_204,
      responseCreateBlog.body.id,
    );

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      responseCreateBlog.body.id,
      {
        id: responseCreateBlog.body.id,
        ...exampleUpdateBlog,
      },
    );
  });

  it('should return status 404 if trying to update non-existing blog', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updateBlogE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100);

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });

  it('should return 401 Unauthorized when deleting a blog with invalid credentials', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removeBlogE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      createBlogResponse.body.id,
    );

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });

  it('should remove existing blog and return status 204', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removeBlogE2eUtil(
      app,
      HTTP_STATUS.NO_CONTENT_204,
      createBlogResponse.body.id,
    );

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });

  it('should return status 404 if trying to delete non-existing blog', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removeBlogE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, -100);

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });
});
