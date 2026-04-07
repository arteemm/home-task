import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthService } from '../auth/domain/auth-service';
import { UsersRepository } from '../users/repositories/user.repository';
import { UsersQueryRepository } from '../users/repositories/user.query.repository';
import { JwtService } from '../auth/adapters/jwt.service';
import { UserService } from '../users/domain/user-service';
import { NodeMailerManager } from '../auth/adapters/nodeMailer-manager';
import { EmailExamples } from '../auth/adapters/emailExamples';

import { SecurityDevicesService } from '../securityDevices/domain/securityDevices.service';
import { SecurityDevicesRepository } from '../securityDevices/repositories/securityDevices.repository';
import { SecurityDevicesQueryRepository } from '../securityDevices/repositories/securityDevices.query.repository';

import { UserController } from '../users/routers/user-controller';
import { AuthController } from '../auth/routers/auth-controller';
import { RateLimitRepository } from '../auth/repositories/rate.limit.repositories';

import { BlogController } from '../blogs/routers/blog-controller';
import { BlogsService } from '../blogs/domain/blogs-service';
import { BlogsRepository } from '../blogs/repositories/blogs.repository';
import { BlogsQueryRepository } from '../blogs/repositories/blogs.query.repositories';

import { PostsController } from '../posts/routers/posts-controller';
import { PostsService } from '../posts/domain/posts-service';
import { PostsRepository } from '../posts/repositories/post.repository';
import { PostsQueryRepository } from '../posts/repositories/post.query.repository';

import { CommentsController } from '../comments/routers/comments-controller';
import { CommentsService } from '../comments/domain/comment-service';
import { CommentRepository } from '../comments/repositories/comment.repository';
import { CommentsQueryRepository } from '../comments/repositories/comment.query.repository';

// import { TYPES } from './types';



export const container = new Container();

container.bind(BlogController).to(BlogController);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);

container.bind(PostsController).to(PostsController);
container.bind(PostsService).to(PostsService);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);

container.bind(CommentsController).to(CommentsController);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentRepository).to(CommentRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);

container.bind(UserController).to(UserController);
container.bind(UserService).to(UserService);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);

container.bind(NodeMailerManager).to(NodeMailerManager);
container.bind(EmailExamples).to(EmailExamples);
container.bind(JwtService).to(JwtService);

container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);
container.bind(RateLimitRepository).to(RateLimitRepository);

container.bind(SecurityDevicesService).to(SecurityDevicesService);
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind(SecurityDevicesQueryRepository).to(SecurityDevicesQueryRepository);

// container.bind(TYPES.BlogCollection).toConstantValue(BlogModel);
// container.bind(TYPES.PostsCollection).toConstantValue(postsCollection);
// container.bind(TYPES.CommentsCollection).toConstantValue(commentsCollection);
// container.bind(TYPES.UsersCollection).toConstantValue(UserModel);
// container.bind(TYPES.SecurityDevicesCollection).toConstantValue(securityDevicesCollection);
// container.bind(TYPES.RateLimitCollection).toConstantValue(rateLimitCollection);