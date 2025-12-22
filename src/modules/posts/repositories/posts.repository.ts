import { UpdatePostDto } from '../dto/update-post.dto';
import { Types, DeleteResult, UpdateResult } from 'mongoose';
import { injectable } from 'inversify';
import { PostModel, PostsDocument } from '../entities/post.entity';

@injectable()
export class PostsRepository {
  async createPost(post: PostsDocument): Promise<string> {
    // const result: PostsDocument = await PostModel.create(body);
    const result: PostsDocument = await post.save();
    return result._id.toString();
  }

  async findPostById(postId: string): Promise<PostsDocument | null> {
    return PostModel.findOne({ _id: new Types.ObjectId(postId) });
  }

  async updatePost(id: string, body: UpdatePostDto): Promise<boolean> {
    const result: UpdateResult = await PostModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { ...body } },
    );

    return result.matchedCount === 1;
  }

  async removePost(id: string): Promise<boolean> {
    const result: DeleteResult = await PostModel.deleteOne({
      _id: new Types.ObjectId(id),
    });

    return result.deletedCount === 1;
  }
}
