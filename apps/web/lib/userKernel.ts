import { Err, Ok, Result } from "@repo/kernel/common";
import { Kernel } from "@repo/kernel/kernel";
import { decomposePackageName } from "@repo/kernel/utils";
import { useRef } from "react";

async function fetchFile(
  userName: string,
  fileName: string,
  version: number,
): Promise<Result<string, string>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/files/${userName}/${fileName}/${version}`,
  );

  if (response.ok) {
    const body = await response.json();

    return Ok(body.content);
  } else {
    return Err(
      `Failed to fetch file "${userName}/${fileName}@${version}": ${response.statusText}`,
    );
  }
}

export function useKernel(): Kernel {
  const kernelRef = useRef<Kernel | null>(null);

  if (!kernelRef.current) {
    kernelRef.current = new Kernel(async (name: string) => {
      const result = decomposePackageName(name);

      if (result.tag === "Err") {
        return Err(result.error);
      }

      const [userName, fileName, version] = result.value;

      return fetchFile(userName, fileName, version);
    });
  }

  return kernelRef.current;
}
