import { HydratedDocument, Model, model, Schema, Types } from 'mongoose';

const BLOG_COLLECTION_NAME = 'blogs';

export type BlogType = {
  /**
   * response successfully dto
   */
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type BlogModelType = Model<BlogType>;

export type BlogDocument = HydratedDocument<BlogType>;

const blogsSchema = new Schema<BlogType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    isMembership: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

export const BlogModel: BlogModelType = model<BlogType, BlogModelType>(
  BLOG_COLLECTION_NAME,
  blogsSchema,
);
