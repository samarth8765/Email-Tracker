import { PrismaClient } from '@prisma/client';

export class DBClient {
  private static instance: PrismaClient;

  private constructor() {}

  static getInstance() {
    if (!DBClient.instance) {
      DBClient.instance = new PrismaClient();
    }
    return DBClient.instance;
  }
}
