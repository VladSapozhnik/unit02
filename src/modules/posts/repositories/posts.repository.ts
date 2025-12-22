import { Types, DeleteResult } from 'mongoose';
import { injectable } from 'inversify';
import { PostModel, PostsDocument } from '../entities/post.entity';

@injectable()
export class PostsRepository {
  async createPost(post: PostsDocument): Promise<string> {
    const result: PostsDocument = await post.save();
    return result._id.toString();
  }

  async findPostById(postId: string): Promise<PostsDocument | null> {
    return PostModel.findOne({ _id: new Types.ObjectId(postId) });
  }

  async updatePost(post: PostsDocument): Promise<string> {
    const result: PostsDocument = await post.save();

    return result._id.toString();
  }

  async removePost(post: PostsDocument): Promise<boolean> {
    const result: DeleteResult = await post.deleteOne();

    return result.deletedCount === 1;
  }
}
