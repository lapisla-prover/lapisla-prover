import { Button } from "@/components/ui/button";
import { Home, Save } from 'lucide-react';
import { Register } from "./register";
import { Share } from "./share";

export function SideMenu() {
  return (
    <div className="fixed left-0 top-0 h-full bg-gray-100 w-16 flex flex-col items-center py-4 space-y-4">
      <Button variant="ghost" size="icon" asChild title="Home">
        <a href="/">
          <Home className="h-6 w-6" />
        </a>
      </Button>

      <Button variant="ghost" size="icon" title="Save">
        <Save className="h-6 w-6" />
      </Button>

      <Button variant="ghost" size="icon" title="Share">
        <Share/>
      </Button>

      <Button variant="ghost" size="icon" title="Register">
        <Register/>
      </Button>
    </div>
  );
}
