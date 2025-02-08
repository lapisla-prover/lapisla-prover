import { PrismaClient } from '@prisma/client';
import { fromThrowableSet } from './fromThrowable';

export async function createState(prisma: PrismaClient, state: string) {
  return fromThrowableSet(
    [],
    [],
    async () =>
      await prisma.state.create({
        data: {
          state: state,
        },
      }),
  );
}
