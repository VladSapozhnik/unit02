import { PostType } from '../types/post.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { postCollection } from '../../../core/db/mango.db';

export const postsRepository = {
  async createPost(body: PostType): Promise<InsertOneResult<PostType>> {
    return postCollection.insertOne(body);
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
