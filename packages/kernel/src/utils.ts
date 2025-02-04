import { Result, Err, Ok } from "./common";

const userNameRegex = "[a-z\\d](?:[a-z\\d]|-(?=[a-z\\d])){0,38}";
const fileNameRegex = "[a-z\\d](?:[a-z\\d]|-(?=[a-z\\d])){0,38}";
const versionRegex = "\\d+";

export function decomposePackageName(name: string): Result<[string, string, number], string> {
  const match = name.match(`^(${userNameRegex})/(${fileNameRegex})@(${versionRegex})$`);

  if (!match) {
    return Err(`Invalid package name "${name}". Expected format: "username/filename@version"`);
  }

  const userName = match[1];
  const fileName = match[2];
  const version = parseInt(match[3]);

  return Ok([userName, fileName, version]);
}
