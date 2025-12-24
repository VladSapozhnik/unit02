import { PostsDocument } from '../entities/post.entity';
import { ExtendedLikesInfoType } from '../../likes/types/extended-likes-info.type';

export type PostAndLikeInfoType = PostsDocument & ExtendedLikesInfoType;
