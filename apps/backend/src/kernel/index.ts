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

export interface CodeAnalyzer {
  listDirectDependencies(sourceCode: string): DependencyMetadata[];
  validate(sourceCode: string, dependencies: Dependency[]): ValidationResult;
}
