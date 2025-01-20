import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilePlus, Send } from "lucide-react";
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
        <Button className="flex items-center gap-1 px-4 py-2">
          Register <FilePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription asChild>
            <div className="flex gap-2 justify-center items-center">
              <div className="w-[40%]">
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
                <Button className="w-full mt-4">
                  Register
                  <FilePlus />
                </Button>
              </div>
              <div className="w-[60%]">
                <div className="w-full h-64 border border-black">
                  <Editor
                    className="h-full w-full"
                    height="100%"
                    theme="vs"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      lineNumbers: "off",
                    }}
                    value="Proof: 1 + 1 = 2"
                  />
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
