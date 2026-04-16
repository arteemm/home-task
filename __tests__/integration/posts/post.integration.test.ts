import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../src/setup-app';
import { LikeOfPostModel } from '../../../src/posts/domain/like-of-post.entiy';
import { createUser } from '../../utils/users/create-user';
import { loginUser } from '../../utils/users/login-user';
import { getUserDto } from '../../utils/users/get-user-dto';
import { createBlog } from '../../utils/blogs/create-blog';
import { createPost } from '../../utils/posts/create-post';
import { getPostDto } from '../../utils/posts/get-post-dto';
import { getBlogDto } from '../../utils/blogs/get-blog-dto';
import { HttpResponceCodes } from '../../../src/core/constants/responseCodes'; 
import { TESTING_PATH, POSTS_PATH } from '../../../src/core/constants/paths';
import { UserViewModel } from '../../../src/users/types/user-view-model';
import { BlogViewModel } from '../../../src/blogs/types/blog-view-model';
import { PostViewModel } from '../../../src/posts/types/post-view-model';
import { LikeOfPostViewModel } from '../../../src/posts/types/likeOfPost-view-model';


describe('Post API Integration Tests', () => {
  const PORT = 5002;
  const mongoURI = 'mongodb://0.0.0.0:27017/home-task';
  let server: any;
  
  beforeAll(async () => {
      await mongoose.connect(mongoURI);
      await request(app).delete(TESTING_PATH);
  });

  afterAll(async () => {
      await mongoose.connection.close();
      if (server) {
          server.close();
      }
  });

  describe('POST /api/posts', () => {
    const userData1 = { login: 'newuser', email: 'new@example.com', password: 'password123'};
    let user1: UserViewModel;
    let accessToken: string;
    let blog: BlogViewModel;
    let post1: PostViewModel & LikeOfPostViewModel;

    it('should create post with valid data', async () => {
      user1 = await createUser(app, userData1, HttpResponceCodes.CREATED_201);

      blog = await createBlog(app, getBlogDto(), HttpResponceCodes.CREATED_201);
      post1 = await createPost(app, {title: 'title1', shortDescription: 'shortDescription1', content: 'content', blogId: blog.id}, HttpResponceCodes.CREATED_201);
    })

    it('should create like of post by user Id', async () => {
      const payload = await loginUser(
        app,
        {
            loginOrEmail: userData1.login,
            password: userData1.password,
        },
          HttpResponceCodes.OK_200
        );
      accessToken = payload.accessToken;

      await request(app)
              .put(POSTS_PATH + `/${post1.id}/like-status`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({likeStatus: 'Like'})
              .expect(HttpResponceCodes.NO_CONTENT_204);
    })

    it('should chnge to "Dislike" and "None" like of post by user Id', async () => {
      await request(app)
              .put(POSTS_PATH + `/${post1.id}/like-status`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({likeStatus: 'None'})
              .expect(HttpResponceCodes.NO_CONTENT_204);
      let result = await LikeOfPostModel.findOne({postId: post1.id, "extendedLikeOfPostInfo.userId": user1.id});
      expect(result?.extendedLikeOfPostInfo[0].likeStatus).toBe('None');

      await request(app)
              .put(POSTS_PATH + `/${post1.id}/like-status`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({likeStatus: 'Dislike'})
              .expect(HttpResponceCodes.NO_CONTENT_204);
      
      result = await LikeOfPostModel.findOne({postId: post1.id, "extendedLikeOfPostInfo.userId": user1.id});
      expect(result?.extendedLikeOfPostInfo[0].likeStatus).toBe('Dislike');
    })

    it('shouldn\'t change to "Dislike" with invalid like-status', async () => {
      await request(app)
              .put(POSTS_PATH + `/${post1.id}/like-status`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({likeStatus: 'Deslike'})
              .expect(HttpResponceCodes.BAD_REQUEST_400);
    })

    it('GET, should return post with likes by post id', async () => {
      let result = await request(app)
        .get(POSTS_PATH + `/${post1.id}`)
        .expect(HttpResponceCodes.OK_200);

      expect(result.body).toEqual({
              id: post1.id,
              title: post1.title,
              shortDescription: post1.shortDescription,
              content: post1.content,
              blogId: post1.blogId,
              blogName: post1.blogName,
              createdAt: expect.any(String),
              extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: 'None',
                newestLikes: []
              }
            })

      await request(app)
        .put(POSTS_PATH + `/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({likeStatus: 'Like'})
        .expect(HttpResponceCodes.NO_CONTENT_204);

      result = await request(app)
        .get(POSTS_PATH + `/${post1.id}`)
        .expect(HttpResponceCodes.OK_200);

      expect(result.body).toEqual({
        id: post1.id,
        title: post1.title,
        shortDescription: post1.shortDescription,
        content: post1.content,
        blogId: post1.blogId,
        blogName: post1.blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [{
            addedAt: expect.any(String),
            userId: user1.id,
            login: user1.login
          }]
        }
      })
    })
    
    it('GET, should return post with user like-status by post id', async () => {
      let result = await request(app)
        .get(POSTS_PATH + `/${post1.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpResponceCodes.OK_200);

      expect(result.body.extendedLikesInfo).toEqual({
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'Like',
          newestLikes: [{
            addedAt: expect.any(String),
            userId: user1.id,
            login: user1.login
          }]
      })
    })

    it('GET, should return post LIST with likes', async () => {
      let result = await request(app)
        .get(POSTS_PATH)
        .expect(HttpResponceCodes.OK_200);

      expect(result.body.items[0].extendedLikesInfo).toEqual({
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [{
            addedAt: expect.any(String),
            userId: user1.id,
            login: user1.login
          }]
      })
    })

    it('GET, should return post with user like-status', async () => {
      let result = await request(app)
        .get(POSTS_PATH)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpResponceCodes.OK_200);

      expect(result.body.items[0].extendedLikesInfo).toEqual({
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'Like',
          newestLikes: [{
            addedAt: expect.any(String),
            userId: user1.id,
            login: user1.login
          }]
      })
    })

    it('GET, should return post with 6 user like-status', async () => {
        await LikeOfPostModel.deleteMany();
        await request(app).delete(POSTS_PATH + `/${post1.id}`).auth('admin', 'qwerty').expect(HttpResponceCodes.NO_CONTENT_204);

        const login2 = 'login2';
        const password2 = 'login2';
        const email2 = 'login2@mail.ru';
        const login3 = 'login3';
        const password3 = 'login3';
        const email3 = 'login3@mail.ru';
        const login4 = 'login4';
        const password4 = 'login4';
        const email4 = 'login4@mail.ru';

        const user2 = await createUser( app, getUserDto({login: login2, password: password2, email: email2}), HttpResponceCodes.CREATED_201);
        const payload2 = await loginUser(app, {loginOrEmail: login2, password: password2 }, HttpResponceCodes.OK_200);
        const accessToken2 = payload2.accessToken;
        const user3 = await createUser( app, getUserDto({login: login3, password: password3, email: email3}), HttpResponceCodes.CREATED_201);
        const payload3 = await loginUser(app, {loginOrEmail: login3, password: password3 }, HttpResponceCodes.OK_200);
        const accessToken3 = payload3.accessToken;
        const user4 = await createUser( app, getUserDto({login: login4, password: password4, email: email4}), HttpResponceCodes.CREATED_201);
        const payload4 = await loginUser(app, {loginOrEmail: login4, password: password4 }, HttpResponceCodes.OK_200);
        const accessToken4 = payload4.accessToken;

        post1 = await createPost( app, getPostDto({blogId: blog.id}), HttpResponceCodes.CREATED_201);
        const post2 = await createPost( app, getPostDto({blogId: blog.id}), HttpResponceCodes.CREATED_201);
        const post3 = await createPost( app, getPostDto({blogId: blog.id}), HttpResponceCodes.CREATED_201);
        const post4 = await createPost( app, getPostDto({blogId: blog.id}), HttpResponceCodes.CREATED_201);
        const post5 = await createPost( app, getPostDto({blogId: blog.id}), HttpResponceCodes.CREATED_201);
        const post6 = await createPost( app, getPostDto({blogId: blog.id}), HttpResponceCodes.CREATED_201);

        await request(app).put(POSTS_PATH + `/${post1.id}/like-status`).set('Authorization', `Bearer ${accessToken}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post1.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post2.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post2.id}/like-status`).set('Authorization', `Bearer ${accessToken3}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post3.id}/like-status`).set('Authorization', `Bearer ${accessToken}`).send({likeStatus: 'Dislike'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post4.id}/like-status`).set('Authorization', `Bearer ${accessToken}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post4.id}/like-status`).set('Authorization', `Bearer ${accessToken4}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post4.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post4.id}/like-status`).set('Authorization', `Bearer ${accessToken3}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post5.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post5.id}/like-status`).set('Authorization', `Bearer ${accessToken3}`).send({likeStatus: 'Dislike'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post6.id}/like-status`).set('Authorization', `Bearer ${accessToken}`).send({likeStatus: 'Like'}).expect(HttpResponceCodes.NO_CONTENT_204);
        await request(app).put(POSTS_PATH + `/${post6.id}/like-status`).set('Authorization', `Bearer ${accessToken2}`).send({likeStatus: 'Dislike'}).expect(HttpResponceCodes.NO_CONTENT_204);
        
        const result = await request(app)
            .get(POSTS_PATH)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpResponceCodes.OK_200);
        
        expect(result.body).toEqual({
                "pagesCount":1,"page":1,"pageSize":10,"totalCount":6,"items":[
                  {
                        id: post6.id,
                        title: post6.title,
                        shortDescription: post6.shortDescription,
                        content: post6.content,
                        blogId: post6.blogId,
                        blogName: post6.blogName,
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                          likesCount: 1,
                          dislikesCount: 1,
                          myStatus: 'Like',
                          newestLikes: [
                            {
                              addedAt: expect.any(String),
                              userId: user1.id,
                              login: user1.login
                            },
                          ]
                        }
                    },
                    {
                        id: post5.id,
                        title: post5.title,
                        shortDescription: post5.shortDescription,
                        content: post5.content,
                        blogId: post5.blogId,
                        blogName: post5.blogName,
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                          likesCount: 1,
                          dislikesCount: 1,
                          myStatus: 'None',
                          newestLikes: [
                            {
                            addedAt: expect.any(String),
                            userId: user2.id,
                            login: user2.login
                            },
                          ]
                        }
                    },
                    {
                        id: post4.id,
                        title: post4.title,
                        shortDescription: post4.shortDescription,
                        content: post4.content,
                        blogId: post4.blogId,
                        blogName: post4.blogName,
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                          likesCount: 4,
                          dislikesCount: 0,
                          myStatus: 'Like',
                          newestLikes: [
                           {
                            addedAt: expect.any(String),
                            userId: user4.id,
                            login: user4.login
                            },
                            {
                            addedAt: expect.any(String),
                            userId: user2.id,
                            login: user2.login
                            },
                            {
                            addedAt: expect.any(String),
                            userId: user3.id,
                            login: user3.login
                            },
                          ]
                        }
                    },
                    {
                        id: post3.id,
                        title: post3.title,
                        shortDescription: post3.shortDescription,
                        content: post3.content,
                        blogId: post3.blogId,
                        blogName: post3.blogName,
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                          likesCount: 0,
                          dislikesCount: 1,
                          myStatus: 'Dislike',
                          newestLikes: []
                        }
                    },
                    {
                        id: post2.id,
                        title: post2.title,
                        shortDescription: post2.shortDescription,
                        content: post2.content,
                        blogId: post2.blogId,
                        blogName: post2.blogName,
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                          likesCount: 2,
                          dislikesCount: 0,
                          myStatus: 'None',
                          newestLikes: [
                            {
                            addedAt: expect.any(String),
                            userId: user2.id,
                            login: user2.login
                            },
                            {
                            addedAt: expect.any(String),
                            userId: user3.id,
                            login: user3.login
                            },
                          ]
                        }
                    },
                    {
                        id: post1.id,
                        title: post1.title,
                        shortDescription: post1.shortDescription,
                        content: post1.content,
                        blogId: post1.blogId,
                        blogName: post1.blogName,
                        createdAt: expect.any(String),
                        extendedLikesInfo: {
                          likesCount: 2,
                          dislikesCount: 0,
                          myStatus: 'Like',
                          newestLikes: [
                            {
                              addedAt: expect.any(String),
                              userId: user1.id,
                              login: user1.login
                            },
                            {
                              addedAt: expect.any(String),
                              userId: user2.id,
                              login: user2.login
                            }
                          ]
                        }
                    },
                ]})
    })
  });

});
