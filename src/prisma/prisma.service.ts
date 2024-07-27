import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: (process.env.NODE_ENV === 'test') ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL
        },
      },
    });    

    this.$use(async (params, next) => {
      if (params.action !== 'create') {
        params.args.where = { ...params.args.where, deletedAt: null };
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
