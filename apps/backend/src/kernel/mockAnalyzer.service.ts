import { Injectable } from "@nestjs/common";
import { AbstractCodeAnalyzerService, DependencyMetadata, Dependency, ValidationResult } from "./index";
import { Ok } from "neverthrow"
import { KernelError } from "./index";
import { getSnapshotInfoFromId } from "src/utils";


@Injectable()
export class MockAnalyzerService extends AbstractCodeAnalyzerService {

    constructor() {
        super();
    }

    listDirectDependencies(sourceCode: string): Ok<{kind: 'success', value: DependencyMetadata[]} | {kind: 'invalid_source'}, KernelError> {
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

    validate(sourceCode: string, dependencies: Dependency[]): ValidationResult {
        return {
            kind: 'validation_success',
            success: true
        }
        /* TS build error: Fix Me!
        const result = executeProgram(sourceCode);
        if (result.tag == 'Err') {
            return {
                success: false,
                kind: 'kernel_error',
                errorMessage: result.error
            }
        }
        else if (result.value) {
            return {
                kind: 'validation_success',
                success: true
            }
        }
        else {
            return {
        success: false,
        kind: 'source_error',
                errorMessage: 'Validation failed'
            }
        }
        */
    }
}
