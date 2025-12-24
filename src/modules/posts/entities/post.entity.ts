import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';

const POST_COLLECTION_NAME = 'posts';

type PostsType = {
  /**
   * response successfully created dto
   */
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;
  blogName: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PostsModelType = Model<PostsType>;

export type PostsDocument = HydratedDocument<PostsType>;

const postsSchema = new Schema<PostsType>(
  {
    title: { type: String, required: true, min: 1, max: 255 },
    shortDescription: { type: String, required: true, min: 1, max: 1000 },
    content: { type: String, required: true, min: 1, max: 1000 },
    blogId: {
      type: Schema.Types.ObjectId,
      required: true,
      min: 1,
    },
    blogName: { type: String, required: true, min: 1, max: 255 },
  },
  { timestamps: true },
);

export const PostModel: PostsModelType = model<PostsType, PostsModelType>(
  POST_COLLECTION_NAME,
  postsSchema,
);
