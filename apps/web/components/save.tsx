import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save as SaveIcon } from "lucide-react";
import { useState } from "react";

interface SaveProps {
  fileName: string;
  content: string;
  setRecentSavedTime: (recentSavedTime: string) => void;
  setNewVersion: (newVersion: number) => void;
}

export const Save = (props: SaveProps) => {
  const [dialogHeader, setDialogHeader] = useState<string>("New version saved");
  const [dialogDescription, setDialogDescription] = useState<string>(
    "Your new version is ",
  );
  const save = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me/files/${props.fileName}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: props.content,
          }),
        },
      );
      const data = await response.json();
      if (data.result === "newly_saved") {
        setDialogHeader("New version saved");
        setDialogDescription(`Your new version is ${data.snapshot.version}`);
        props.setRecentSavedTime(data.snapshot.createdAt);
        props.setNewVersion(data.snapshot.version);
      } else {
        setDialogHeader("New version was not saved");
        setDialogDescription("No changes were made");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Save" onClick={save}>
          <SaveIcon className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogHeader}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button className="flex items-center gap-1 px-3 py-1 text-xs mr-2">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
