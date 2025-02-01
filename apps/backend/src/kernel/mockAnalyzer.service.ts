import { Injectable } from "@nestjs/common";
import { executeProgram } from "@repo/kernel/kernel";
import { decomposePackageName } from "@repo/kernel/utils";
import { Ok } from "neverthrow";
import { PrismaService } from "src/prisma.service";
import { getSnapshotInfoFromId } from "src/utils";
import { AbstractCodeAnalyzerService, Dependency, DependencyMetadata, KernelError, ValidationResult } from "./index";


@Injectable()
export class MockAnalyzerService extends AbstractCodeAnalyzerService {
    protected prisma: PrismaService;

    constructor(private prismaService: PrismaService) {
        super();
        this.prisma = prismaService;
    }

    listDirectDependencies(sourceCode: string): Ok<{ kind: 'success', value: DependencyMetadata[] } | { kind: 'invalid_source' }, KernelError> {
        const importCandidate = sourceCode
            .split('\n')
            .filter(line => line.startsWith('import'));
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
            const snapInfo = getSnapshotInfoFromId(snapshotId)
                .match(
                    (snapshotInfo) => snapshotInfo,
                    () => {
                        return null;
                    }
                );
            if (!snapInfo) {
                return new Ok({ kind: 'invalid_source' });
            }
            dependencies.push({
                owner: snapInfo.owner,
                name: snapInfo.fileName,
                version: snapInfo.version
            });
        }
        return new Ok({ kind: 'success', value: dependencies });
    }

    private async fetchFile(pkgName: string): Promise<string> {
        const result = decomposePackageName(pkgName);
        if (result.tag === "Err") {
            throw new Error(result.error);
        }
        const [userName, fileName, version] = result.value;

        const userId = await this.prisma.users.findUnique({
            where: {
                name: userName
            }
        }).catch((err) => {
            throw new Error('Internal Error');
        }).then((user) => {
            if (!user) {
                throw new Error('User not found');
            }
            return user.id;
        }).finally(() => { });

        const file = await this.prisma.files.findUnique({
            where: {
                ownerId_name: {
                    ownerId: userId,
                    name: fileName
                }
            }
        }).catch((err) => {
            throw new Error('Internal Error');
        }).then((file) => {
            if (!file) {
                throw new Error('File not found');
            }
            return file;
        }).finally(() => { });

        const snapshot = await this.prisma.snapshots.findUnique({
            where: {
                fileId_version: {
                    fileId: file.id,
                    version: version
                }
            }
        }).catch((err) => {
            throw new Error('Internal Error');
        }).then((snapshot) => {
            if (!snapshot) {
                throw new Error('Snapshot not found');
            }
            return snapshot;
        }).finally(() => { });

        return snapshot.content;
    }


    async validate(sourceCode: string, dependencies: Dependency[]): Promise<ValidationResult> {
        const result = await executeProgram(sourceCode,
            async (pkgName: string) => {
                try {
                    return {
                        tag: "Ok",
                        value: await this.fetchFile(pkgName)
                    }
                } catch (e) {
                    return {
                        tag: "Err",
                        error: 'Import Error: ' + e.message
                    }
                }
            },
        );

        if (result.success) {
            return {
                kind: 'validation_success',
                success: true
            }
        } else {
            if (result.errorType === "InternalError") {
                return {
                    success: false,
                    kind: 'kernel_error',
                    errorMessage: result.errorMessage
                }
            }
            else if (result.errorType === "ProgramError") {
                return {
                    success: false,
                    kind: 'source_error',
                    errorMessage: result.errorMessage
                }
            }
        }
    }
}
