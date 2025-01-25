import { useRef } from "react";
import { Kernel } from "@repo/kernel/kernel";

export function useKernel(): Kernel {
  const kernelRef = useRef<Kernel | null>(null);

  if (!kernelRef.current) {
    kernelRef.current = new Kernel();
  }

  return kernelRef.current;
}
