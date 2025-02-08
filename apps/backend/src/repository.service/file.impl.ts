import { PrismaClient } from '@prisma/client';
import {
  fromThrowableSet,
  fromThrowableGet,
  fromThrowableDelete,
} from './fromThrowable';

export async function getFile(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
) {
  return fromThrowableGet(
    async () =>
      await prisma.file.findUnique({
        where: {
          ownerName_fileName: {
            ownerName: ownerName,
            fileName: fileName,
          },
        },
      }),
  );
}

export async function getFileWithSnapshots(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
) {
  return fromThrowableGet(
    async () =>
      await prisma.file.findUnique({
        where: {
          ownerName_fileName: {
            ownerName: ownerName,
            fileName: fileName,
          },
        },
        include: {
          snapshots: true,
        },
      }),
  );
}

export async function getFileWithPublicSnapshots(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
) {
  return fromThrowableGet(
    async () =>
      await prisma.file.findUnique({
        where: {
          ownerName_fileName: {
            ownerName: ownerName,
            fileName: fileName,
          },
        },
        include: {
          snapshots: {
            where: {
              isPublic: true,
            },
          },
        },
      }),
  );
}

export async function getPublicFile(
  prisma: PrismaClient,
  userName: string,
  fileName: string,
) {
  return fromThrowableGet(
    async () =>
      await prisma.file.findUnique({
        where: {
          ownerName_fileName: {
            ownerName: userName,
            fileName: fileName,
          },
          snapshots: {
            some: {
              isPublic: true,
            },
          },
        },
      }),
  );
}

export async function getPublicFileWithPublicSnapshots(
  prisma: PrismaClient,
  userName: string,
  fileName: string,
) {
  return fromThrowableGet(
    async () =>
      await prisma.file.findUnique({
        where: {
          ownerName_fileName: {
            ownerName: userName,
            fileName: fileName,
          },
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
      }),
  );
}

export async function createFile(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
) {
  return fromThrowableSet(
    [
      async () =>
        await prisma.user.findUnique({
          where: {
            userName: ownerName,
          },
        }),
    ],
    [
      async () =>
        await prisma.file.findUnique({
          where: {
            ownerName_fileName: {
              ownerName: ownerName,
              fileName: fileName,
            },
          },
        }),
    ],
    async () =>
      await prisma.file.create({
        data: {
          ownerName: ownerName,
          fileName: fileName,
        },
      }),
  );
}

export async function deleteFile(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
) {
  return fromThrowableDelete(
    [
      async () =>
        await prisma.user.findUnique({
          where: {
            userName: ownerName,
          },
        }),
    ],
    async () =>
      await prisma.file.delete({
        where: {
          ownerName_fileName: {
            ownerName: ownerName,
            fileName: fileName,
          },
        },
      }),
  );
}
