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
  blogId: string;

  constructor(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ) {
    super(title, shortDescription, content);
    this.blogId = blogId;
  }
}
