export class CommentOutputType {
  /**
   * type exist comment
   */
  id: string;
  postId: string;
  content: string;
  commentatorInfo: { userId: string; userLogin: string };
  createdAt: string;

  constructor(
    id: string,
    postId: string,
    content: string,
    commentatorInfo: { userId: string; userLogin: string },
    createdAt: string,
  ) {
    this.id = id;
    this.postId = postId;
    this.content = content;
    this.commentatorInfo = commentatorInfo;
    this.createdAt = createdAt;
  }
}
