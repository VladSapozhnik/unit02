import { LikesInfoOutputType } from '../../likes/types/likes-info-output.type';

export class CommentOutputType {
  /**
   * type exist comment
   */
  id: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;
  likesInfo: LikesInfoOutputType;

  constructor(
    id: string,
    content: string,
    commentatorInfo: { userId: string; userLogin: string },
    createdAt: string,
    likesInfo: LikesInfoOutputType,
  ) {
    this.id = id;
    this.content = content;
    this.commentatorInfo = commentatorInfo;
    this.createdAt = createdAt;
    this.likesInfo = likesInfo;
  }
}
