import { Register } from "@/components/register";
import { Save } from "@/components/save";
import { Share } from "@/components/share";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/context/accountContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Book, ChartGantt, Folder, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface SideMenuProps {
  fileName?: string;
  content?: string;
  version?: number;
  setRecentSavedTime?: (recentSavedTime: string) => void;
  setNewVersion?: (newVersion: number) => void;
  enabledFeatures: Set<
    "home" | "files" | "timeline" | "document" | "save" | "share" | "register"
  >;
}

export function SideMenu(props: SideMenuProps) {
  const router = useRouter();
  const { account } = useAccount();

  return (
    <div className="left-0 top-0 h-screen bg-gray-100 w-24 flex flex-col items-center py-4 space-y-4">
      {props.enabledFeatures.has("home") && (
        <Button
          variant="ghost"
          size="icon"
          title="Home"
          onClick={() => router.push("/")}
        >
          <Home className="h-6 w-6" />
        </Button>
      )}

      {props.enabledFeatures.has("files") && (
        <Button
          variant="ghost"
          size="icon"
          title="Files"
          onClick={() => router.push("/files")}
        >
          <Folder className="h-6 w-6" />
        </Button>
      )}

      {props.enabledFeatures.has("timeline") && (
        <Button
          variant="ghost"
          size="icon"
          title="Timeline"
          onClick={() => router.push("/timeline")}
        >
          <ChartGantt className="h-6 w-6" />
        </Button>
      )}

      {props.enabledFeatures.has("document") && (
        <a href="https://docs.lapisla.net" target="_blank" rel="noreferrer">
          <Button variant="ghost" size="icon" title="Document">
            <Book className="h-6 w-6" />
          </Button>
        </a>
      )}

      {props.enabledFeatures.has("save") &&
        props.fileName &&
        props.content &&
        props.setRecentSavedTime && (
          <Save
            fileName={props.fileName}
            content={props.content}
            setRecentSavedTime={props.setRecentSavedTime}
            setNewVersion={props.setNewVersion}
          />
        )}

      {props.enabledFeatures.has("share") &&
        props.fileName &&
        props.version !== undefined && (
          <Share
            owner={account.username}
            fileName={props.fileName}
            version={props.version}
          />
        )}

      {props.enabledFeatures.has("register") && props.fileName && (
        <Register fileName={props.fileName} />
      )}

      <Avatar className="h-10 w-10">
        <AvatarImage
          src={`https://avatars.githubusercontent.com/u/${account.username}?v=4`}
          alt={account.username}
        />
      </Avatar>
    </div>
  );
}
