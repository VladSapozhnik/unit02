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
import { getCommentByIdE2eUtil } from './utils/comments/get-comment-by-id.e2e.util';
import {
  exampleUpdateComment,
  updateCommentE2eUtil,
} from './utils/comments/update-comment.e2e.util';
import { ObjectIdValid } from './blogs.e2e.spec';
import { removeCommentE2eUtil } from './utils/comments/remove-comment.e2e.util';
import { getCommentsForPostE2eUtil } from './utils/comments/get-comments-for-post-e2e.util';
import { CommentType } from '../src/modules/comments/types/comment.type';

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

    createdPost = responsePost.body;
  });

  it('should not create a comment and return 401 for invalid token', async () => {
    await createCommentE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      createdPost.id,
      userToken,
    );
  });

  it('should not create a comment and return 400 for bad request', async () => {
    await createCommentE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
      createdPost.id,
      userToken,
    );
  });

  it('should not create a comment and return 404 for not found postId', async () => {
    await createCommentE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      createdPost.id,
      userToken,
    );
  });

  let createdComment: any;
  it('should created comment and status 201 for valid body', async () => {
    const response: Response = await createCommentE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
      createdPost.id,
      userToken,
    );

    createdComment = response.body;
  });

  it('should get a comment and return 200 for valid commentId', async () => {
    await getCommentByIdE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createdComment.id,
      createdComment,
    );
  });

  it('should not get comment and return 404 for non-existent commentId', async () => {
    await getCommentByIdE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      ObjectIdValid,
      {},
    );
  });

  it('should not update a comment and return 401 for invalid token', async () => {
    await updateCommentE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      createdComment.id,
      userToken,
    );
  });

  it('should not update a comment and return 400 for bad request', async () => {
    await updateCommentE2eUtil(
      app,
      HTTP_STATUS.BAD_REQUEST_400,
      createdComment.id,
      userToken,
    );
  });

  it('should not update a comment and return 404 for not found commentId', async () => {
    await updateCommentE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      ObjectIdValid,
      userToken,
    );
  });

  it('should not update a comment and return 403 for forbidden user', async () => {
    await updateCommentE2eUtil(
      app,
      HTTP_STATUS.FORBIDDEN_403,
      createdComment.id,
      userTokenTwo,
    );
  });

  it('should return 204 and update comment for valid body', async () => {
    await updateCommentE2eUtil(
      app,
      HTTP_STATUS.NO_CONTENT_204,
      createdComment.id,
      userToken,
    );

    createdComment.content = exampleUpdateComment.content;
  });

  it('should return 404 for non-existent post', async () => {
    await getCommentsForPostE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      createdComment,
      createdPost.id,
    );
  });

  it('should return 200 for exist post and one comment and pagination', async () => {
    await getCommentsForPostE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      createdComment,
      createdPost.id,
    );
  });

  it('should return 200 for exist post and two comments and pagination', async () => {
    const response: Response = await createCommentE2eUtil(
      app,
      HTTP_STATUS.CREATED_201,
      createdPost.id,
      userToken,
    );

    const commentTwo: CommentType = response.body;

    await getCommentsForPostE2eUtil(
      app,
      HTTP_STATUS.OK_200,
      commentTwo,
      createdPost.id,
      true,
    );
  });

  it('should not remove a comment and return 401 for invalid token', async () => {
    await removeCommentE2eUtil(
      app,
      HTTP_STATUS.UNAUTHORIZED_401,
      createdComment.id,
      userToken,
    );
  });

  it('should not remove a comment and return 404 for not found commentId', async () => {
    await removeCommentE2eUtil(
      app,
      HTTP_STATUS.NOT_FOUND_404,
      ObjectIdValid,
      userToken,
    );
  });

  it('should not remove a comment and return 403 for forbidden user', async () => {
    await removeCommentE2eUtil(
      app,
      HTTP_STATUS.FORBIDDEN_403,
      createdComment.id,
      userTokenTwo,
    );
  });

  it('should return 204 and remove comment for valid commentId', async () => {
    await removeCommentE2eUtil(
      app,
      HTTP_STATUS.NO_CONTENT_204,
      createdComment.id,
      userToken,
    );
  });
});
