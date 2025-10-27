import { PostType } from '../types/post.type';
import { CreatePostDto } from '../dto/create-post.dto';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { BlogType } from '../../blogs/types/blog.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import {
  DeleteResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import { postCollection } from '../../../core/db/mango.db';

export const postsRepository = {
  async getAllPosts(): Promise<WithId<PostType>[]> {
    return postCollection.find().toArray();
  },

  async createPost(body: PostType): Promise<InsertOneResult<PostType>> {
    return postCollection.insertOne(body);
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
