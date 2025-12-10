// export type CreatePostDto = {
//   /**
//    * body create dto
//    */
//   title: string;
//   shortDescription: string;
//   content: string;
//   blogId: string;
// };
//
// export type CreatePostForBlogDto = Omit<CreatePostDto, 'blogId'>;

import { ObjectId } from 'mongodb';

export class BasePostInput {
  title: string;
  shortDescription: string;
  content: string;

  constructor(title: string, shortDescription: string, content: string) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
  }
}

export class CreatePostForBlogDto extends BasePostInput {}

export class CreatePostDto extends BasePostInput {
  blogId: string | ObjectId;

  constructor(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string | ObjectId,
  ) {
    super(title, shortDescription, content);
    this.blogId = blogId;
  }
}
