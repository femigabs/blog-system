import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from '../dtos/post.dto';
import { GetPostEntity, PostEntity } from '../entities/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(payload: CreatePostDto): Promise<PostEntity> {
    const { title, content, authorId } = payload;

    return this.prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
  }

  async getAllPosts(data: GetPostEntity): Promise<PostEntity[]> {
    const { page = 1, pageSize = 10, authorId, q } = data;
    const pageNumber = Number(page);
    const pageSizeNumber = Number(pageSize);

    const whereClause = this.buildWhereClause(authorId, q);

    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      where: whereClause,
      skip: (pageNumber - 1) * pageSizeNumber,
      take: pageSizeNumber,
      orderBy: { createdAt: 'desc' },
    });
  }

  private buildWhereClause(authorId: number | undefined, q: string | undefined): any {
    const whereClause: any = {};

    if (authorId) {
      whereClause.authorId = authorId;
    }

    if (q) {
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ];
    }

    return whereClause;
  }

  async getPost(id: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async updatePost(id: number, body: UpdatePostDto): Promise<PostEntity> {
    const { authorId, ...data } = body;

    return this.prisma.post.update({
      where: { id, authorId },
      data,
    });
  }

  async deletePost(id: number, authorId: number): Promise<PostEntity> {
    const post = await this.prisma.post.findUnique({
      where: { id}
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    };

    if (post.authorId !== authorId) {
      throw new ForbiddenException();
    };
  
    return this.prisma.post.update({
      where: { id, authorId },
      data: {
        title: post.title + ' _DELETED_' + `${Date.now()}`,
        deletedAt: new Date(),
      },
    });
  }
}