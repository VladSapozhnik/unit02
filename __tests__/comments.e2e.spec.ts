import { setupApp } from '../src/setup-app';
import { HTTP_STATUS } from '../src/core/enums/http-status.enum';
import { Response } from 'supertest';
import express from 'express';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';
import { RouterPathConst } from '../src/core/constants/router-path.const';
import { runDB, stopDB } from '../src/core/db/mango.db';
import { settings } from '../src/core/settings/settings';
import {
  ACTION_CREATE_USER,
  createUserE2eUtil,
} from './utils/users/create-user.e2e.util';
import { createPostAndBlogE2eUtil } from './utils/posts/create-post-and-blog-e2e.util';
import { loginE2eUtil } from './utils/auth/login.e2e.util';
import { createCommentE2eUtil } from './utils/comments/create-comment-e2e.util';

describe('test' + RouterPathConst.comments, () => {
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
  let userToken: any;
  let userTokenTwo: any;
  let post: any;
  it('should created two users and created post and blog status 201 for valid body', async () => {
    await createUserE2eUtil(app, HTTP_STATUS.CREATED_201);

    const response: Response = await loginE2eUtil(app, HTTP_STATUS.OK_200);

    userToken = response.body.accessToken;

    await createUserE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
      ACTION_CREATE_USER.PAGINATION_AND_SEARCH,
    );

    const responseUserTwo: Response = await loginE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      true,
    );

    userTokenTwo = responseUserTwo.body.accessToken;

    const responsePost: Response = await createPostAndBlogE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
    );

    post = responsePost.body;
  });

  it('should not create a comment and return 401 for invalid token', async () => {
    await createCommentE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      post.id,
      userToken,
    );
  });

  it('should not create a comment and return 400 for bad request', async () => {
    await createCommentE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
      post.id,
      userToken,
    );
  });

  it('should not create a comment and return 404 for not found postId', async () => {
    await createCommentE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      post.id,
      userToken,
    );
  });

  let createdComment: any;
  it('should created comment and status 201 for valid body', async () => {
    const response: Response = await createCommentE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
      post.id,
      userToken,
    );

    createdComment = response.body;
  });
});
