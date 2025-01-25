import { Button } from "@/components/ui/button";
import { Book, Folder, Home } from "lucide-react";
import { Register } from "@/components/register";
import { Share } from "@/components/share";
import { Save } from "@/components/save";
import { useRouter } from "next/navigation";

interface SideMenuProps {
  fileName: string;
  content: string;
  snapshotId: string;
  setSnapshotId: (snapshotId: string) => void;
}

export function SideMenu(props: SideMenuProps) {
  const router = useRouter();
  return (
    <div className="left-0 top-0 h-screen bg-gray-100 w-24 flex flex-col items-center py-4 space-y-4">
      <Button
        variant="ghost"
        size="icon"
        title="Home"
        onClick={() => router.push("/")}
      >
        <Home className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="Files"
        onClick={() => router.push("/files")}
      >
        <Folder className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        title="Document"
        onClick={() => router.push("/")}
      >
        <Book className="h-6 w-6" />
      </Button>

      <Save
        fileName={props.fileName}
        content={props.content}
        setSnapshotId={props.setSnapshotId}
      />

      <Share snapshotId={props.snapshotId} />

      <Register fileName={props.fileName} />
    </div>
  );
}
