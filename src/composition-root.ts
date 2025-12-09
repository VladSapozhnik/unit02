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
import { UsersController } from './modules/users/routes/users.controller';
import { UsersService } from './modules/users/application/users.service';
import { UsersRepository } from './modules/users/repositories/users.repository';
import { UsersQueryRepository } from './modules/users/repositories/users.query.repository';
import { AuthController } from './modules/auth/routes/auth.controller';
import { AuthService } from './modules/auth/application/auth.service';
import { SecurityDevicesController } from './modules/security-devices/routes/security-devices.controller';
import { SecurityDevicesQueryRepository } from './modules/security-devices/repositories/security-devices.query.repository';
import { SecurityDevicesRepository } from './modules/security-devices/repositories/security-devices.repository';
import { SecurityDevicesService } from './modules/security-devices/application/security-devices.service';
import { SecurityDevicesQueryService } from './modules/security-devices/application/security-devices.query.service';
import { AuthGuardMiddleware } from './core/middleware/jwt-auth-guard.middleware';
import { RateLimitRepository } from './modules/rate-limit/repositories/rate-limit.repository';
import { RateLimitMiddleware } from './core/middleware/rate-limit.middleware';

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

//users
container.bind(UsersController).to(UsersController);
container.bind(UsersService).to(UsersService);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);

//auth
container.bind(AuthController).to(AuthController);
container.bind(AuthService).to(AuthService);

//securityDevices
container.bind(SecurityDevicesController).to(SecurityDevicesController);
container.bind(SecurityDevicesService).to(SecurityDevicesService);
container.bind(SecurityDevicesQueryService).to(SecurityDevicesQueryService);
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container
  .bind(SecurityDevicesQueryRepository)
  .to(SecurityDevicesQueryRepository);

//rateLimit
container.bind(RateLimitRepository).to(RateLimitRepository);

//middleware
container.bind(AuthGuardMiddleware).to(AuthGuardMiddleware);
container.bind(RateLimitMiddleware).to(RateLimitMiddleware);
