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
import { useState } from "react";

export const Share = () => {
  const [permanentLink, setPermanentLink] = useState<string>(
    "https://lapisla.net/view?id=hogehogehugahuga"
  );
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
              <Button className="w-full" onClick={() => {}}>
                Post
                <img src="/X.svg" className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
