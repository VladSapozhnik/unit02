export class CreateBlogDto {
  /**
   * body create dto
   */
  name: string;
  description: string;
  websiteUrl: string;

  constructor(name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
  }
}
