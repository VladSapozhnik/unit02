import { Express } from 'express';
import { HTTP_STATUS } from '../../../../src/core/enums/http-status.enum';
import request from 'supertest';
import { RouterPathConst } from '../../../../src/core/constants/router-path.const';
import { Response } from 'supertest';
import { ObjectIdValid } from '../../blogs.e2e.spec';
import { CommentDocument } from '../../../../src/modules/comments/entities/comment.entity';
import { PostsDocument } from '../../../../src/modules/posts/entities/post.entity';

export const getCommentByIdE2eUtil = async (
  app: Express,
  statusCode: HTTP_STATUS,
  id: string = ObjectIdValid,
  comment: CommentDocument | {},
): Promise<Response> => {
  let commentId: string = id;
  let findComment: PostsDocument | {} = comment;

  if (statusCode === HTTP_STATUS.NOT_FOUND_404) {
    commentId = ObjectIdValid;

    return await request(app)
      .get(RouterPathConst.comments + commentId)
      .expect(statusCode);
  }

  if (statusCode === HTTP_STATUS.BAD_REQUEST_400) {
    findComment = {};
  }

  return await request(app)
    .get(RouterPathConst.comments + commentId)
    .expect(statusCode, findComment);
};
