// Import your user model
import { Prisma, PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user: prisma.user;
        }
    }
}
