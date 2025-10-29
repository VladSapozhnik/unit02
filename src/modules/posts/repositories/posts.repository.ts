import { PostType } from '../types/post.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import { postCollection } from '../../../core/db/mango.db';
import { PostQueryInput } from '../routes/input/post-query.input';
import { ResultAndTotalCountType } from '../../../core/types/result-and-total-count.type';
import { getSkipOffset } from '../../../core/helpers/get-skip-offset';

export const postsRepository = {
  async getAllPosts(
    queryDto: PostQueryInput,
  ): Promise<ResultAndTotalCountType<WithId<PostType>>> {
    const skip: number = getSkipOffset(queryDto.page, queryDto.pageSize);

    const posts: WithId<PostType>[] = await postCollection
      .find()
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(skip)
      .toArray();

    const totalCount: number = await postCollection.countDocuments();

    return { items: posts, totalCount };
  },

  async createPost(body: PostType): Promise<InsertOneResult<PostType>> {
    return postCollection.insertOne(body);
  },

  async getPostsByBlogId(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<ResultAndTotalCountType<WithId<PostType>>> {
    const skip: number = getSkipOffset(queryDto.page, queryDto.pageSize);

    const posts: WithId<PostType>[] = await postCollection
      .find({ blogId })
      .sort({ [queryDto.sortBy]: queryDto.sortDirection })
      .limit(queryDto.pageSize)
      .skip(skip)
      .toArray();

    const totalCount: number = await postCollection.countDocuments({ blogId });

    return { items: posts, totalCount };
  },

  async getPostById(id: string): Promise<WithId<PostType> | null> {
    return await postCollection.findOne({ _id: new ObjectId(id) });
  },

  async updatePost(
    id: string,
    body: UpdatePostDto,
  ): Promise<UpdateResult<PostType>> {
    return postCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body } },
    );
  },

  async removePost(id: string): Promise<DeleteResult> {
    return await postCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
