import { PrismaClient } from '@prisma/client';
import { fromThrowableSet, fromThrowableGet } from './fromThrowable';

export async function updateTagsAndDescription(
  prisma: PrismaClient,
  ownerName: string,
  fileName: string,
  version: number,
  tags: string[],
  description: string,
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
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: {
                name: tag,
              },
              create: {
                name: tag,
              },
            })),
          },
          description: description,
        },
      }),
  );
}

export async function getTags(prisma: PrismaClient) {
  return fromThrowableGet(async () => await prisma.tag.findMany());
}
