import { Injectable } from '@nestjs/common';
import { executeProgram } from '@repo/kernel/kernel';
import { decomposePackageName } from '@repo/kernel/utils';
import { Ok } from 'neverthrow';
import { RepositoryService } from '@/repository.service';
import { getSnapshotInfoFromId } from 'src/utils';
import {
  AbstractCodeAnalyzerService,
  Dependency,
  DependencyMetadata,
  KernelError,
  ValidationResult,
} from './index';
import { DbNotFoundError } from '@/repository.service/fromThrowable';

@Injectable()
export class CodeAnalyzerService extends AbstractCodeAnalyzerService {
  protected repo: RepositoryService;

  constructor(private repositoryService: RepositoryService) {
    super();
    this.repo = repositoryService;
  }

  listDirectDependencies(
    sourceCode: string,
  ): Ok<
    | { kind: 'success'; value: DependencyMetadata[] }
    | { kind: 'invalid_source' },
    KernelError
  > {
    const importCandidate = sourceCode
      .split('\n')
      .filter((line) => line.startsWith('import'));
    let dependencies: DependencyMetadata[] = [];
    for (let line of importCandidate) {
      const split = line.split(' ');
      if (split.length < 2) {
        return new Ok({ kind: 'invalid_source' });
      }
      if (split[1].length < 2) {
        return new Ok({ kind: 'invalid_source' });
      }
      const depName = split[1].substring(1, split[1].length - 1);
      const snapshotId = Buffer.from(depName).toString('hex');
      const snapInfo = getSnapshotInfoFromId(snapshotId).match(
        (snapshotInfo) => snapshotInfo,
        () => {
          return null;
        },
      );
      if (!snapInfo) {
        return new Ok({ kind: 'invalid_source' });
      }
      dependencies.push({
        ownerName: snapInfo.owner,
        fileName: snapInfo.fileName,
        version: snapInfo.version,
      });
    }
    return new Ok({ kind: 'success', value: dependencies });
  }

  private async fetchFile(pkgName: string): Promise<string> {
    const result = decomposePackageName(pkgName);
    if (result.tag === 'Err') {
      throw new Error(result.error);
    }
    const [userName, fileName, version] = result.value;
    return (
      await this.repo.getPublicSnapshotWithContent(userName, fileName, version)
    ).match(
      (snapshot) => snapshot.content.content,
      (error) => {
        if (error instanceof DbNotFoundError) {
          throw new Error('Resource not found');
        }
        throw new Error('Internal Error');
      },
    );
  }

  async validate(
    sourceCode: string,
    dependencies: Dependency[],
  ): Promise<ValidationResult> {
    const result = await executeProgram(sourceCode, async (pkgName: string) => {
      try {
        return {
          tag: 'Ok',
          value: await this.fetchFile(pkgName),
        };
      } catch (e) {
        return {
          tag: 'Err',
          error: 'Import Error: ' + e.message,
        };
      }
    });

    if (result.success) {
      return {
        kind: 'validation_success',
        success: true,
      };
    } else {
      if (result.errorType === 'InternalError') {
        return {
          success: false,
          kind: 'kernel_error',
          errorMessage: result.errorMessage,
        };
      } else if (result.errorType === 'ProgramError') {
        return {
          success: false,
          kind: 'source_error',
          errorMessage: result.errorMessage,
        };
      }
    }
  }
}
