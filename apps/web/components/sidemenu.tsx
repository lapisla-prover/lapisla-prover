import { Button } from "@/components/ui/button";
import { Home, Save } from "lucide-react";
import { Register } from "@/components/register";
import { Share } from "@/components/share";
import { useRouter } from "next/navigation";

export function SideMenu() {
  const router = useRouter();
  return (
    <div className="fixed left-0 top-0 h-full bg-gray-100 w-16 flex flex-col items-center py-4 space-y-4">
      <Button
        variant="ghost"
        size="icon"
        title="Home"
        onClick={() => router.push("/")}
      >
        <Home className="h-6 w-6" />
      </Button>

      <Button variant="ghost" size="icon" title="Save">
        <Save className="h-6 w-6" />
      </Button>

      <Share />

      <Register />
    </div>
  );
}
