import { PostType } from '../types/post.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import { postsCollection } from '../../../core/db/mango.db';

export const postsRepository = {
  async createPost(body: PostType): Promise<InsertOneResult<PostType>> {
    return postsCollection.insertOne(body);
  },

  async findPostById(postId: string): Promise<WithId<PostType> | null> {
    return postsCollection.findOne({ _id: new ObjectId(postId) });
  },

  async updatePost(
    id: string,
    body: UpdatePostDto,
  ): Promise<UpdateResult<PostType>> {
    return postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body } },
    );
  },

  async removePost(id: string): Promise<DeleteResult> {
    return await postsCollection.deleteOne({ _id: new ObjectId(id) });
  },
};
