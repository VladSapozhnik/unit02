import request, { type Response } from 'supertest';
import { setupApp } from '../src/setup-app';
import { HTTP_STATUS } from '../src/core/enums/http-status.enum';
import { type ErrorType } from '../src/core/types/error.type';
import { RouterPath } from '../src/core/constants/router-path';
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
import { runDB, stopDB } from '../src/core/db/mango.db';
import { settings } from '../src/core/settings/settings';
import { BlogSortField } from '../src/modules/blogs/routes/input/blog-sort-field';
import { SortDirection } from '../src/core/enums/sort-direction.enum';
import { BlogQueryInput } from '../src/modules/blogs/routes/input/blog-query.input';

export const ObjectIdValid = '68f7b37aec3bd9b7be0c000c';

const validateErrors: ErrorType[] = [
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
  { message: expect.any(String), field: expect.any(String) },
];

describe('test' + RouterPath.blogs, () => {
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
    await request(app).get(RouterPath.blogs).expect(200, {
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('blogs returns empty items array and correct pagination for empty result', async () => {
    const paginationDefault: BlogQueryInput = {
      searchBlogNameTerm: 'test',
      sortBy: BlogSortField.CreatedAt,
      sortDirection: SortDirection.Asc,
      pageSize: 20,
      pageNumber: 3,
    };

    await request(app)
      .get(RouterPath.blogs)
      .query(paginationDefault)
      .expect(200, {
        pagesCount: 0,
        page: paginationDefault.pageNumber,
        pageSize: paginationDefault.pageSize,
        totalCount: 0,
        items: [],
      });
  });

  it('should return status 400 and array of errors when create dto with invalid data', async () => {
    const response = await createBlogE2eUtil(app, HTTP_STATUS.BAD_REQUEST_400);

    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining(validateErrors),
    );
  });

  it('should create dto and return 201 with created dto body', async () => {
    const response = await createBlogE2eUtil(app, HTTP_STATUS.CREATED_201);

    expect(response.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      ...exampleCreateBlog,
      isMembership: expect.any(Boolean),
    });
  });

  it('should return 401 Unauthorized when creating a dto with invalid credentials', async () => {
    await createBlogE2eUtil(app, HTTP_STATUS.UNAUTHORIZED_401);
  });

  it('should return object dto and return 200', async () => {
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

  it('should return status 404 for not-existing dto', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await getBlogByIdE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, ObjectIdValid);

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });

  it('should return status 400 and array of errors when update dto with invalid data', async () => {
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

  it('should return 401 Unauthorized when updating a dto with invalid credentials', async () => {
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

  it('should update existing dto and return status 204', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updateBlogE2eUtil(
      app,
      HTTP_STATUS.NO_CONTENT_204,
      createBlogResponse.body.id,
    );

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      {
        id: createBlogResponse.body.id,
        ...exampleUpdateBlog,
        createdAt: createBlogResponse.body.createdAt,
        isMembership: createBlogResponse.body.isMembership,
      },
    );
  });

  it('should return status 404 if trying to update non-existing dto', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await updateBlogE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, ObjectIdValid);

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });

  it('should return 401 Unauthorized when deleting a dto with invalid credentials', async () => {
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

  it('should remove existing dto and return status 204', async () => {
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

  it('should return status 404 if trying to delete non-existing dto', async () => {
    const createBlogResponse: Response = await createBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    await removeBlogE2eUtil(app, HTTP_STATUS.NOT_FOUND_404, ObjectIdValid);

    await getBlogByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createBlogResponse.body.id,
      createBlogResponse.body,
    );
  });
});
