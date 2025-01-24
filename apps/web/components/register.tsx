import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilePlus, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@monaco-editor/react";

export const Register = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Register">
          <UserPlus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto h-auto max-w-[100vw] max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription>
            Register a new version of your proof.
          </DialogDescription>
        </DialogHeader>
        <div className="flex py-4">
          <div className="flex flex-col items-center m-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Version</SelectLabel>
                  <SelectItem value="v10">v10</SelectItem>
                  <SelectItem value="v9">v9</SelectItem>
                  <SelectItem value="v8">v8</SelectItem>
                  <SelectItem value="v7">v7</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto m-2 mb-2 mt-auto">
              Register
              <FilePlus className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="min-h-[300px] h-[60vh] w-[60vw] border border-gray-200 rounded-md overflow-hidden">
            <Editor
              className="h-auto w-full"
              height="100%"
              theme="vs-light"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: "off",
              }}
              value={`Proof: 1 + 1 = 2\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\naaaaaaaa`}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
