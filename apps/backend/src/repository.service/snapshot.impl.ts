import { PrismaClient } from '@prisma/client';
import {
  fromThrowableSet,
  fromThrowableGet,
  fromThrowableDelete,
  combineError,
} from './fromThrowable';

import { Ok, Err, Result } from 'neverthrow';
import { ok } from 'assert';

export async function getSnapshot(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
  version: number,
) {
  return fromThrowableGet(
    async () =>
      await prisma.snapshot.findUnique({
        where: {
          ownerName_fileName_version: {
            ownerName: ownerName,
            fileName: fileName,
            version: version,
          },
        },
        include: {
          tags: true,
        }
      }),
  );
}

export async function getSnapshotWithContent(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
  version: number,
) {
  return fromThrowableGet(
    async () =>
      await prisma.snapshot.findUnique({
        where: {
          ownerName_fileName_version: {
            ownerName: ownerName,
            fileName: fileName,
            version: version,
          },
        },
        include: {
          tags: true,
          content: true,
        },
      }),
  );
}

export async function getPublicSnapshot(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
  version: number,
) {
  return fromThrowableGet(
    async () =>
      await prisma.snapshot.findUnique({
        where: {
          ownerName_fileName_version: {
            ownerName: ownerName,
            fileName: fileName,
            version: version,
          },
          isPublic: true,
        },
        include: {
          tags: true,
        },
      }),
  );
}

export async function getPublicSnapshotWithContent(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
  version: number,
) {
  return fromThrowableGet(
    async () =>
      await prisma.snapshot.findUnique({
        where: {
          ownerName_fileName_version: {
            ownerName: ownerName,
            fileName: fileName,
            version: version,
          },
          isPublic: true,
        },
        include: {
          tags: true,
          content: true,
        },
      }),
  );
}

export async function createSnapshot(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
  content: string,
) {
  const result = (await (await fromThrowableGet(
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
        }
      }),
  ))
    .match(
      async (file) => {
        return (await fromThrowableSet(
          [],
          [],
          async () =>
            await prisma.snapshot.create({
              data: {
                ownerName: ownerName,
                fileName: fileName,
                version: file.snapshots.length,
                content: {
                  create: {
                    content: content,
                  },
                },
                isPublic: false,
                file: {
                  connect: {
                    ownerName_fileName: {
                      ownerName: ownerName,
                      fileName: fileName,
                    },
                  },
                },
              },
            }),
        ))
      },
      err => new Err(err),
    ));
  return combineError(result);
}

export async function publishSnapshot(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
  version: number,
) {
  return fromThrowableSet(
    [
      async () =>
        await prisma.snapshot.findUnique({
          where: {
            ownerName_fileName_version: {
              ownerName: ownerName,
              fileName: fileName,
              version: version,
            },
          },
        }),
    ],
    [],
    async () =>
      await prisma.snapshot.update({
        where: {
          ownerName_fileName_version: {
            ownerName: ownerName,
            fileName: fileName,
            version: version,
          },
        },
        data: {
          isPublic: true,
        },
      }),
  );
}
