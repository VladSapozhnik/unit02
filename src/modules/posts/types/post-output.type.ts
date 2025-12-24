import { ExtendedLikesInfoType } from '../../likes/types/extended-likes-info.type';

export type PostOutputType = {
  /**
   * response successfully created dto
   */
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoType;
};
