import { Injectable } from "@nestjs/common";
import { AbstractCodeAnalyzerService, DependencyMetadata, Dependency, ValidationResult } from "./index";

@Injectable()
export class MockAnalyzerService extends AbstractCodeAnalyzerService {

    constructor() {
        super();
    }

    listDirectDependencies(sourceCode: string): DependencyMetadata[] {
        return [
            {
                owner: 'test-owner',
                name: 'test-name',
                version: '0'
            }
        ]
    }
    validate(sourceCode: string, dependencies: Dependency[]): ValidationResult {
        return { success: true };
    }
}
