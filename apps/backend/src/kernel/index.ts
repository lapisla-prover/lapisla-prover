import { Injectable } from '@nestjs/common';

export type ValidationResult =
  | ValidationSuccess
  | ValidationFailed
  | KernelError;

export type ValidationSuccess = {
  success: true;
};

export type ValidationFailed = {
  success: false;
  reason: 'source_error';
  errorMessage: string;
};

export type KernelError = {
  success: false;
  reason: 'kernel_error';
  errorMessage: string;
};

export interface DependencyMetadata {
  owner: string;
  name: string;
  version: string;
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

export type 

export interface ICodeAnalyzer {
  listDirectDependencies(sourceCode: string): DependencyMetadata[];
  validate(sourceCode: string, dependencies: Dependency[]): ValidationResult;
}

@Injectable()
export abstract class AbstractCodeAnalyzerService implements ICodeAnalyzer {
  abstract listDirectDependencies(sourceCode: string): DependencyMetadata[];
  abstract validate(sourceCode: string, dependencies: Dependency[]): ValidationResult;
}
