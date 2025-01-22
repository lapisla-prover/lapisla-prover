export function getSnapshotId(owner: string, fileName: string, version: number) {
  const data = `${owner}/${fileName}@${version}`;
  return Buffer.from(data).toString('hex');
}

export function getSnapshotInfoFromId(id: string) {
  const data = Buffer.from(id, 'hex').toString();
  const [owner, other] = data.split('/');
  const [fileName, version] = other.split('@');
  if (!/^[A-Za-z0-9-]+$/.test(owner)) {
    throw new Error('Invalid owner format');
  }
  if (!/^[A-Za-z0-9-.]+$/.test(fileName)) {
    throw new Error('Invalid file name format');
  }
  if (!/^\d+$/.test(version)) {
    throw new Error('Invalid version format');
  }
  return { owner, fileName, version: parseInt(version) };
}