import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from '../src/post/post.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { CreatePostDto, UpdatePostDto } from '../src/dtos/post.dto';
import { GetPostEntity } from '../src/entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { HelperService } from '../src/common/utils';

describe('PostService', () => {
  let service: PostService;
  let authService: AuthService;
  let prisma: PrismaService;

  interface UserEntity {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    authorId?: number;
  };

  let userData: UserEntity = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'testuser2',
    password: "Password7$"
  };

  let postId: number

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRE },
        })
      ],
      providers: [PostService, AuthService, PrismaService, HelperService],
    }).compile();

    service = module.get<PostService>(PostService);
    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should create a new user', async () => {
    const response = await authService.register(userData);
    expect(response.firstName).toBe(userData.firstName);
    expect(response.lastName).toBe(userData.lastName);
    userData.authorId = response.id;
  });

  it('should create a new post', async () => {
    const createPostDto: CreatePostDto = {
      title: 'Hello World',
      content: 'This is a sample post',
      authorId: userData.authorId,
    };

    const post = await service.create(createPostDto);
    expect(post.title).toBe(createPostDto.title);
    expect(post.content).toBe(createPostDto.content);
    expect(post.authorId).toBe(createPostDto.authorId);
    postId = post.id;
  });

  it('should find all posts', async () => {
    const getPostEntity: GetPostEntity = {
      page: 1,
      pageSize: 10,
    };

    const posts = await service.findAll(getPostEntity);
    expect(posts.length).toBeGreaterThan(0);
  });

  it('should find one post by ID', async () => {
    const post = await service.findOne(postId);
    expect(post.id).toBe(postId);
  });

  it('should update a post', async () => {
    const updatePostDto: UpdatePostDto = {
      title: 'Hello World Updated',
      content: 'This is an updated sample post',
      authorId: userData.authorId,
    };

    const post = await service.updatePost(postId, updatePostDto);
    expect(post.title).toBe(updatePostDto.title);
    expect(post.content).toBe(updatePostDto.content);
  });

  it('should remove a post', async () => {
    try {
      await service.removePost(postId, userData.authorId);
      await service.findOne(postId);

    } catch (error) {
      expect(error.message).toEqual('Post not found');
    }
  });
});
