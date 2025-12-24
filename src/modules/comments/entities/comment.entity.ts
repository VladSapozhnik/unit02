import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

const COMMENT_COLLECTION_NAME = 'comments';

type CommentsInfoType = { userId: Types.ObjectId; userLogin: string };

export type CommentType = {
  /**
   * type exist comment
   */
  postId: Types.ObjectId;
  content: string;
  commentatorInfo: CommentsInfoType;
  createdAt: Date;
  updatedAt: Date;
};

type CommentModelType = Model<CommentType>;

export type CommentDocument = HydratedDocument<CommentType>;

const commentsInfoSchema = new Schema<CommentsInfoType>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    userLogin: { type: String, required: true, trim: true, min: 1, max: 255 },
  },
  { _id: false },
);

const commentsSchema = new Schema<CommentType>(
  {
    postId: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true, min: 1, max: 1000, trim: true },
    commentatorInfo: commentsInfoSchema,
  },
  { timestamps: true },
);

export const CommentModel: CommentModelType = model<
  CommentType,
  CommentModelType
>(COMMENT_COLLECTION_NAME, commentsSchema);
