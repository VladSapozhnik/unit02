import { setupApp } from '../../src/setup-app';
import { HTTP_STATUS } from '../../src/core/enums/http-status.enum';
import { Response } from 'supertest';
import express from 'express';
import { clearDbE2eUtil } from './utils/clear-db.e2e.util';
import { RouterPathConst } from '../../src/core/constants/router-path.const';
import { runDB, stopDB } from '../../src/core/db/mango.db';
import {
  ACTION_CREATE_USER,
  createUserE2eUtil,
} from './utils/users/create-user.e2e.util';
import { createPostAndBlogE2eUtil } from './utils/posts/create-post-and-blog-e2e.util';
import { loginE2eUtil } from './utils/auth/login.e2e.util';
import { createCommentE2eUtil } from './utils/comments/create-comment-e2e.util';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { likeStatusForCommentE2eUtil } from './utils/comments/like-status-for-comment-e2e.util';
import { isLikeForCommentE2eUtil } from './utils/comments/is-likes-e2e.util';

describe('test' + RouterPathConst.comments + 'likes', () => {
  const app = express();
  setupApp(app);
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const url: string = mongoServer.getUri();
    await runDB(url);
    await clearDbE2eUtil(app);
  });

  afterAll(async () => {
    await clearDbE2eUtil(app);
    await mongoServer.stop();
    await stopDB();
  });

  describe('likes', () => {
    let userToken: any;
    let createdPost: any;
    it('should created two users and created post and blog status 201 for valid body', async () => {
      await createUserE2eUtil(app, HTTP_STATUS.CREATED_201);

      const response: Response = await loginE2eUtil(app, HTTP_STATUS.OK_200);

      userToken = response.body.accessToken;

      await createUserE2eUtil(
        app,
        HTTP_STATUS.CREATED_201,
        ACTION_CREATE_USER.PAGINATION_AND_SEARCH,
      );

      const responsePost: Response = await createPostAndBlogE2eUtil(
        app,
        HTTP_STATUS.CREATED_201,
      );

      createdPost = responsePost.body;
    });

    it('should set like status and return myStatus=Like for authorized user', async () => {
      const responseComment: Response = await createCommentE2eUtil(
        app,
        HTTP_STATUS.CREATED_201,
        createdPost.id,
        userToken,
      );

      const createdComment = responseComment.body;

      await likeStatusForCommentE2eUtil(
        app,
        HTTP_STATUS.NO_CONTENT_204,
        createdComment.id,
        userToken,
      );

      await isLikeForCommentE2eUtil(
        app,
        HTTP_STATUS.OK_200,
        createdComment.id,
        userToken,
        1,
      );
    });

    it('should return likeStatus None for unauthorized user even if like was set by authorized user', async () => {
      const responseComment: Response = await createCommentE2eUtil(
        app,
        HTTP_STATUS.CREATED_201,
        createdPost.id,
        userToken,
      );

      const createdComment = responseComment.body;

      await likeStatusForCommentE2eUtil(
        app,
        HTTP_STATUS.NO_CONTENT_204,
        createdComment.id,
        userToken,
      );

      await isLikeForCommentE2eUtil(
        app,
        HTTP_STATUS.UNAUTHORIZED_401,
        createdComment.id,
        userToken,
        1,
      );
    });

    it('should return 401 if user is not authorized when setting like status for comment', async () => {
      const responseComment: Response = await createCommentE2eUtil(
        app,
        HTTP_STATUS.CREATED_201,
        createdPost.id,
        userToken,
      );

      const createdComment = responseComment.body;

      await likeStatusForCommentE2eUtil(
        app,
        HTTP_STATUS.UNAUTHORIZED_401,
        createdComment.id,
        userToken,
      );

      await isLikeForCommentE2eUtil(
        app,
        HTTP_STATUS.UNAUTHORIZED_401,
        createdComment.id,
        userToken,
        0,
      );
    });

    it('should return 400 if like status is invalid', async () => {
      const responseComment: Response = await createCommentE2eUtil(
        app,
        HTTP_STATUS.CREATED_201,
        createdPost.id,
        userToken,
      );

      const createdComment = responseComment.body;

      await likeStatusForCommentE2eUtil(
        app,
        HTTP_STATUS.BAD_REQUEST_400,
        createdComment.id,
        userToken,
      );

      await isLikeForCommentE2eUtil(
        app,
        HTTP_STATUS.UNAUTHORIZED_401,
        createdComment.id,
        userToken,
        0,
      );
    });

    it('should return 404 if comment does not exist', async () => {
      const responseComment: Response = await createCommentE2eUtil(
        app,
        HTTP_STATUS.CREATED_201,
        createdPost.id,
        userToken,
      );

      const createdComment = responseComment.body;

      await likeStatusForCommentE2eUtil(
        app,
        HTTP_STATUS.NOT_FOUND_404,
        createdComment.id,
        userToken,
      );

      await isLikeForCommentE2eUtil(
        app,
        HTTP_STATUS.UNAUTHORIZED_401,
        createdComment.id,
        userToken,
        0,
      );
    });
  });
});
