import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShareIcon, Clipboard } from "lucide-react";
import { getSnapshotId } from "@/utils/parseSnapshot";

interface SaveProps {
  owner: string;
  fileName: string;
  version: number;
}

export const Share = (props: SaveProps) => {
  const permanentLink = `https://lapisla.net/view?id=${getSnapshotId(props.owner, props.fileName, props.version)}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Share">
          <ShareIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permanent link here!</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="text-lg m-4 break-all">{permanentLink}</div>
              <Button
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(permanentLink);
                }}
              >
                Copy
                <Clipboard className="ml-2 h-4 w-4" />
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  window.open(
                    `https://x.com/intent/post?url=${permanentLink}`,
                    "_blank",
                  );
                }}
              >
                Post
                <img
                  src="/X.svg"
                  className="ml-2 h-4 w-4 pointer-events-none"
                />
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
