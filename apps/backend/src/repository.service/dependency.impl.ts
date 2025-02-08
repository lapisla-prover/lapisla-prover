import { PrismaClient } from '@prisma/client';
import {
  fromThrowableSet,
  fromThrowableGet,
  fromThrowableDelete,
} from './fromThrowable';

export async function setDependencies(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
  version: number,
  dependTo: { ownerName: string; fileName: string; version: number }[],
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
          dependTo: {
            connect: dependTo.map((d) => ({
              ownerName_fileName_version: {
                ownerName: d.ownerName,
                fileName: d.fileName,
                version: d.version,
              },
            })),
          }
        },
      })
  );
}

export async function getDependencies(
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
          dependTo: {
            include: {
              content: true,
            }
          },
          content: true,
        },
      }),
  );
}


export async function getPublicSnapshotsWithContent(
  prisma: PrismaClient,
  snapshots: { ownerName: string; fileName: string, version: number }[],
) {
  return fromThrowableGet(
    async () =>
      await prisma.snapshot.findMany({
        where: {
          OR: snapshots,
          isPublic: true,
        },
        include: {
          content: true,
        },
      }),
  );
}