import { Types } from 'mongoose';

export class UpdatePostDto {
  /**
   * body for updating a successfully found video
   */
  title: string;
  shortDescription: string;
  content: string;
  blogId: Types.ObjectId;

  constructor(
    title: string,
    shortDescription: string,
    content: string,
    blogId: Types.ObjectId,
  ) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
  }
}
