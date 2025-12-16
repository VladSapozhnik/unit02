import { LikeStatusEnum } from '../../likes/enums/like-status.enum';

export class LikesInfoOutputType {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
  constructor(
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusEnum,
  ) {
    this.likesCount = likesCount;
    this.dislikesCount = dislikesCount;
    this.myStatus = myStatus;
  }
}

export class CommentOutputType {
  /**
   * type exist comment
   */
  id: string;
  postId: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: LikesInfoOutputType;

  constructor(
    id: string,
    postId: string,
    content: string,
    commentatorInfo: { userId: string; userLogin: string },
    createdAt: string,
    likesInfo: LikesInfoOutputType,
  ) {
    this.id = id;
    this.postId = postId;
    this.content = content;
    this.commentatorInfo = commentatorInfo;
    this.createdAt = createdAt;
    this.likesInfo = likesInfo;
  }
}
