import { Result, Ok, Err } from 'neverthrow';

export function getSnapshotId(owner: string, fileName: string, version: number) {
  const data = `${owner}/${fileName}@${version}`;
  return Buffer.from(data).toString('hex');
}

type SnapshotInfo = {
  owner: string;
  fileName: string;
  version: number;
};

export function getSnapshotInfoFromId(id: string): Result<SnapshotInfo, string> {
  const data = Buffer.from(id, 'hex').toString();
  const [owner, other] = data.split('/');
  const [fileName, version] = other.split('@');
  if (!/^[A-Za-z0-9-]+$/.test(owner)) {
    return new Err('Invalid owner format');
  }
  if (!/^[A-Za-z0-9-.]+$/.test(fileName)) {
    return new Err('Invalid file name format');
  }
  if (!/^\d+$/.test(version)) {
    return new Err('Invalid version format');
  }
  return new Ok({ owner, fileName, version: parseInt(version) });
}

export function isValidTag(tag) {
  return /^[A-Za-z0-9-ぁ-んァ-ヶー亜-熙]+$/.test(tag);
}