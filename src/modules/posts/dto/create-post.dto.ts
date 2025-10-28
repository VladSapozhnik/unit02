export type CreatePostDto = {
  /**
   * body create dto
   */
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type CreatePostForBlogDto = Omit<CreatePostDto, 'blogId'>;
