import { PrismaClient } from '@prisma/client';
import {
  fromThrowableSet,
  fromThrowableGet,
  fromThrowableDelete,
} from './fromThrowable';

export async function getUser(prisma: PrismaClient, userName: string) {
  return fromThrowableGet(
    async () =>
      await prisma.user.findUnique({
        where: {
          userName: userName,
        },
      }),
  );
}

export async function getUsers(prisma: PrismaClient, userNames: string[]) {
  return fromThrowableGet(
    async () =>
      await prisma.user.findMany({
        where: {
          userName: {
            in: userNames,
          },
        },
      }),
  );
}

export async function getAllUsers(prisma: PrismaClient) {
  return fromThrowableGet(async () => await prisma.user.findMany());
}

export async function createUser(
  prisma: PrismaClient,
  userName: string,
  githubId: number,
) {
  return fromThrowableSet(
    [],
    [
      async () =>
        await prisma.user.findUnique({
          where: {
            userName: userName,
          },
        }),
    ],
    async () =>
      await prisma.user.create({
        data: {
          userName: userName,
          githubId: githubId,
        },
      }),
  );
}

export async function deleteUser(prisma: PrismaClient, userName: string) {
  return fromThrowableDelete(
    [
      async () =>
        await prisma.user.findUnique({
          where: {
            userName: userName,
          },
        }),
    ],
    async () =>
      await prisma.user.delete({
        where: {
          userName: userName,
        },
      }),
  );
}

export async function getUserWithFiles(prisma: PrismaClient, userName: string) {
  return fromThrowableGet(
    async () =>
      await prisma.user.findUnique({
        where: {
          userName: userName,
        },
        include: {
          files: true,
        },
      }),
  );
}

export async function getUserWithPublicFiles(
  prisma: PrismaClient,
  userName: string,
) {
  return fromThrowableGet(
    async () =>
      await prisma.user.findUnique({
        where: {
          userName: userName,
        },
        include: {
          files: {
            where: {
              snapshots: {
                some: {
                  isPublic: true,
                },
              },
            },
          },
        },
      }),
  );
}

export async function getUserWithFilesAndSnapshots(
  prisma: PrismaClient,
  userName: string,
) {
  return fromThrowableGet(
    async () =>
      await prisma.user.findUnique({
        where: {
          userName: userName,
        },
        include: {
          files: {
            include: {
              snapshots: true,
            },
          },
        },
      }),
  );
}

export async function getUserWithPublicFilesAndSnapshots(
  prisma: PrismaClient,
  userName: string,
) {
  return fromThrowableGet(
    async () =>
      await prisma.user.findUnique({
        where: {
          userName: userName,
        },
        include: {
          files: {
            where: {
              snapshots: {
                some: {
                  isPublic: true,
                },
              },
            },
            include: {
              snapshots: {
                where: {
                  isPublic: true,
                },
              },
            },
          },
        },
      }),
  );
}
