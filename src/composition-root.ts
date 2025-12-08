import 'reflect-metadata';
import { BlogsService } from './modules/blogs/application/blogs.service';
import { BlogsRepository } from './modules/blogs/repositories/blogs.repository';
import { BlogsController } from './modules/blogs/routes/blogs.controller';
import { BlogsQueryRepository } from './modules/blogs/repositories/blogs.query.repository';
import { Container } from 'inversify';
import { PostsController } from './modules/posts/routes/posts.controller';
import { PostsService } from './modules/posts/application/posts.service';
import { PostsRepository } from './modules/posts/repositories/posts.repository';
import { PostsQueryRepository } from './modules/posts/repositories/posts.query.repository';
import { CommentsController } from './modules/comments/routes/comments.controller';
import { CommentsService } from './modules/comments/application/comments.service';
import { CommentsRepository } from './modules/comments/repositories/comments.repository';
import { CommentsQueryRepository } from './modules/comments/repositories/comments.query.repository';

// const blogsRepository = new BlogsRepository();
// const blogsQueryRepository = new BlogsQueryRepository();
// const blogsService = new BlogsService(blogsRepository);
// export const blogsController = new BlogsController(
//   blogsService,
//   blogsQueryRepository,
// );

export const container: Container = new Container();

//blogs
container.bind(BlogsController).to(BlogsController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);

//posts
container.bind(PostsController).to(PostsController);
container.bind(PostsService).to(PostsService);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);

//comments
container.bind(CommentsController).to(CommentsController);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
