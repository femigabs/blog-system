import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JoiValidationPipe, ResponseService } from '../common/utils';
import { getPostSchema, createPostSchema, idSchema, updatePostSchema } from '../validations/post.validations';
import { CreatePostDto, UpdatePostDto } from '../dtos/post.dto';
import { GetPostEntity } from '../entities/post.entity';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly responseService: ResponseService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Request() req, @Body(new JoiValidationPipe(createPostSchema)) body: CreatePostDto) {
    body.authorId = req.user.id;
    try {
      const post = await this.postService.createPost(body);

      return this.responseService.generateSuccessResponse(
        post,
        'Post created successfully'
      );

    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getAllPosts(@Query(new JoiValidationPipe(getPostSchema)) query: GetPostEntity) {
    try {
      const posts = await this.postService.getAllPosts(query);

      return this.responseService.generateSuccessResponse(
        posts,
        'Posts fetched successfully'
      );
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async getPost(@Param(new JoiValidationPipe(idSchema)) params: any) {
    try {
      const posts = await this.postService.getPost(Number(params.id));

      return this.responseService.generateSuccessResponse(
        posts,
        'Post fetched successfully'
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updatePost(@Request() req, @Param(new JoiValidationPipe(idSchema)) params: any, @Body(new JoiValidationPipe(updatePostSchema)) body: UpdatePostDto) {
    body.authorId = req.user.id;

    try {
      const post = await this.postService.updatePost(Number(params.id), body);

      return this.responseService.generateSuccessResponse(
        post,
        'Post updated successfully'
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Request() req, @Param(new JoiValidationPipe(idSchema)) params: any) {
    const authorId = req.user.id;
    try {
      await this.postService.deletePost(Number(params.id), authorId);
      
      return this.responseService.generateSuccessResponse(
        null,
        'Post deleted successfully'
      );
    } catch (error) {
      throw error;
    }
  }
}
