import { ObjectId } from 'mongodb';

export type PostType = {
  /**
   * response successfully created post
   */
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
};
