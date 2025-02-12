export function ensureFileExtension(fileName: string): string {
  return fileName.endsWith(".l") ? fileName : `${fileName}.l`;
}
