import { Injectable } from '@nestjs/common';
import { Result } from 'neverthrow';

export type ValidationResult =
  | ValidationSuccess
  | ValidationFailed
  | KernelError;

export type ValidationSuccess = {
  kind: 'validation_success';
  success: true;
};

export type ValidationFailed = {
  success: false;
  kind: 'source_error';
  errorMessage: string;
};

export type KernelError = {
  success: false;
  kind: 'kernel_error';
  errorMessage: string;
};

export interface DependencyMetadata {
  ownerName: string;
  fileName: string;
  version: number;
}

export interface Dependency {
  metadata: DependencyMetadata;
  source: string;
}

export type InvalidSingleSourceCode = {
  success: false;
  reason: 'invalid_single_source_code';
  errorMessage: string;
}

export interface ICodeAnalyzer {
  listDirectDependencies(sourceCode: string): Result<
    {
      kind: 'success', value: DependencyMetadata[]
    }
    | {
      kind: 'invalid_source'
    }, KernelError>;
  validate(sourceCode: string, dependencies: Dependency[]): Promise<ValidationResult>;
}

@Injectable()
export abstract class AbstractCodeAnalyzerService implements ICodeAnalyzer {
  abstract listDirectDependencies(sourceCode: string): Result<
    {
      kind: 'success', value: DependencyMetadata[]
    }
    | {
      kind: 'invalid_source'
    }, KernelError>;
  abstract validate(sourceCode: string, dependencies: Dependency[]): Promise<ValidationResult>;
}
