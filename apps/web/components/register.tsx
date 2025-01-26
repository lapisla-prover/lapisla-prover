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
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import TagForm from "./tagForm";

interface RegisterProps {
  fileName: string;
}

export const Register = (props: RegisterProps) => {
  const [versions, setVersions] = useState<number[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);
  const [dialogHeader, setDialogHeader] = useState<string>("Registered");
  const [dialogDescription, setDialogDescription] = useState<string>(
    "Your new version is registered"
  );
  const [tags, setTags] = useState<string[]>([]);

  const mainEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const fetchFile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me/files/${props.fileName}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setVersions(data.versions.sort((a: number, b: number) => b - a));
      fetchContent(Math.max(...data.versions));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFile();
  }, []);

  const fetchContent = async (version: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me/files/${props.fileName}/${version}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      mainEditorRef.current?.setValue(data.content);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchContent(selectedVersion);
  }, [selectedVersion]);

  function onChangeVersion(value: string) {
    setSelectedVersion(parseInt(value));
  }

  async function register() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me/files/${props.fileName}/${selectedVersion}/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: tags,
            description: "",
          }),
        }
      );
      const data = await response.json();
      if (data.result === "registered") {
        setDialogHeader("Registered");
        setDialogDescription(
          `${props.fileName} v${selectedVersion} is registered`
        );
      } else {
        setDialogHeader("Not registered");
        setDialogDescription("No changes were made");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Register"
          onClick={() => {
            fetchFile();
            setSelectedVersion(versions[versions.length - 1]);
            fetchContent(selectedVersion);
          }}
        >
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
            <Select onValueChange={onChangeVersion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select version" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Version</SelectLabel>
                  {versions &&
                    versions.map((version) => (
                      <SelectItem value={version.toString()} key={version}>
                        v{version}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <TagForm onChange={setTags} />
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full sm:w-auto m-2 mb-2 mt-auto"
                  onClick={register}
                >
                  Register
                  <FilePlus className="ml-2 h-4 w-4" />
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
          </div>
          <div className="min-h-[300px] h-[60vh] w-[60vw] border border-gray-200 rounded-md overflow-hidden">
            <Editor
              className="h-auto w-full"
              height="100%"
              theme="vs-light"
              language="lapisla"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: "off",
              }}
              value={""}
              onMount={(editor, monaco) => {
                mainEditorRef.current = editor;
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
