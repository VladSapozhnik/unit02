import { HydratedDocument, Model, model, Schema } from 'mongoose';

const BLOG_COLLECTION_NAME = 'blogs';

type BlogType = {
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
    name: { type: String, required: true, min: 1, max: 255 },
    description: { type: String, required: true, min: 1, max: 1000 },
    websiteUrl: { type: String, required: true, min: 1, max: 255 },
    isMembership: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

export const BlogModel: BlogModelType = model<BlogType, BlogModelType>(
  BLOG_COLLECTION_NAME,
  blogsSchema,
);
