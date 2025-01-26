import { useRef } from "react";
import { Kernel } from "@repo/kernel/kernel";
import { Err, Ok, Result } from "@repo/kernel/common";

async function fetchFile(userName: string, fileName: string, version: number): Promise<Result<string, string>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/${userName}/${fileName}/${version}`);

  if (response.ok) {
    const body = await response.json();

    return Ok(body.content);
  } else {
    return Err(`Failed to fetch file "${userName}/${fileName}@${version}": ${response.statusText}`);
  }
}

const userNameRegex = "[a-z\\d](?:[a-z\\d]|-(?=[a-z\\d])){0,38}";
const fileNameRegex = "[a-z\\d](?:[a-z\\d]|-(?=[a-z\\d])){0,38}";
const versionRegex = "\\d+";

export function useKernel(): Kernel {
  const kernelRef = useRef<Kernel | null>(null);

  if (!kernelRef.current) {
    kernelRef.current = new Kernel(async (name: string) => {
      const match = name.match(`^(${userNameRegex})/(${fileNameRegex})@(${versionRegex})$`);

      if (!match) {
        return Err(`Invalid package name "${name}"`);
      }

      const userName = match[1];
      const fileName = match[2];
      const version = parseInt(match[3]);

      return fetchFile(userName, fileName, version);
    });
  }

  return kernelRef.current;
}
