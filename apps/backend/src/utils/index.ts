export function getSnapshotId(owner: string, fileName: string, version: number) {
  const data = `${owner}/${fileName}@${version}`;
  return Buffer.from(data).toString('hex');
}
