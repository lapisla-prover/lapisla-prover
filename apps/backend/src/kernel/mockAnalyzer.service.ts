import { Injectable } from "@nestjs/common";
import { AbstractCodeAnalyzerService, DependencyMetadata, Dependency, ValidationResult } from "./index";
import { Ok } from "neverthrow"
import { KernelError } from "./index";
@Injectable()
export class MockAnalyzerService extends AbstractCodeAnalyzerService {

    constructor() {
        super();
    }

    listDirectDependencies(sourceCode: string): Ok<{kind: 'success', value: DependencyMetadata[]}, KernelError> {
        return new Ok({kind: 'success', value: []});
    }
    validate(sourceCode: string, dependencies: Dependency[]): ValidationResult {
        return { success: true, kind: 'validation_success' };
    }
}
