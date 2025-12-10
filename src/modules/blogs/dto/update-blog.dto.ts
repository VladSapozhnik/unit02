// export type UpdateBlogDto = {
//   /**
//    * body for updating successfully found dto
//    */
//   name: string;
//   description: string;
//   websiteUrl: string;
// };

export class UpdateBlogDto {
  /**
   * body for updating successfully found dto
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
