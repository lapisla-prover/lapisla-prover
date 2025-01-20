import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share as ShareIcon, Clipboard, Send } from "lucide-react";
import { useState } from "react";

export const Share = () => {
  const [permanentLink, setPermanentLink] = useState<string>(
    "https://lapisla.net/view?id=hogehogehugahuga"
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1 px-4 py-2">
          Share <ShareIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permanent link here!</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-2 justify-center items-center">
              <div className="text-lg m-4">{permanentLink}</div>
              <Button
                className=""
                onClick={() => {
                  navigator.clipboard.writeText(permanentLink);
                }}
              >
                Copy
                <Clipboard />
              </Button>
              <Button className="" onClick={() => {}}>
                Post
                <Send />
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
