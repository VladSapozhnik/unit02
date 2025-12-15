import { PostDBType } from '../types/post.type';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Types, DeleteResult, UpdateResult } from 'mongoose';
import { PostsModel } from '../../../core/db/mango.db';
import { injectable } from 'inversify';

@injectable()
export class PostsRepository {
  async createPost(body: PostDBType): Promise<string> {
    const result: PostDBType = await PostsModel.create(body);

    return result._id.toString();
  }

  async findPostById(postId: string): Promise<PostDBType | null> {
    return PostsModel.findOne({ _id: new Types.ObjectId(postId) });
  }

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const result: UpdateResult = await PostsModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { ...body } },
    );

    return result.matchedCount === 1;
  }

  async removePost(id: string): Promise<boolean> {
    const result: DeleteResult = await PostsModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
