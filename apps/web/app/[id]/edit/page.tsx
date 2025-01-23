"use client";

import { Register } from "@/components/register";
import { Share } from "@/components/share";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { configureMonaco } from "@/lib/monacoConfig";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Mic,
  Save,
  Search,
} from "lucide-react";

export default function Edit() {
  const monaco = useMonaco();
  if (monaco) {
    configureMonaco(monaco);
  }


  return (
    <div className="flex p-8 gap-8">
      <div className="w-[80%] p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">abap34/simplest-sort.lapis</div>
          <div className="text-gray-500">Last saved 2 minutes ago</div>
        </div>

        <div className="h-0.5 w-full bg-black" />

        <div className="flex gap-2">
          <Button className="flex items-center gap-1 px-4 py-2">
            Save <Save />
          </Button>
          <Share />
          <Register />
        </div>
        <div className="flex gap-2 justify-end">
          <Button className="flex items-center gap-1 p-2">
            <ChevronUp />
          </Button>
          <Button className="flex items-center gap-1 p-2">
            <ChevronDown />
          </Button>
          <Button className="flex items-center gap-1 p-2">
            <ChevronsUp />
          </Button>
          <Button className="flex items-center gap-1 p-2">
            <ChevronsDown />
          </Button>
        </div>

        <Editor
          className="h-full w-full mt-4 border border-black"
          height={"calc(100vh - 200px)"}
          theme="vs"
          language="lapisla"
          options={{
            unicodeHighlight: {
              ambiguousCharacters: false
            }
          }}
          defaultValue="# Write your proof here!"
          
        />
      </div>

      <div className="w-[40%] p-4 space-y-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Registry"
            className="pl-9 pr-9 rounded-full border border-muted bg-background"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Voice search"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

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

        <div>
          <div className="text-2xl font-bold">Suggestion:</div>
          <div className="text-gray-700">Proof Found!</div>
        </div>

        <div className="w-full h-32 border border-black">
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

        <div className="grid w-full gap-2">
          <Textarea placeholder="Chat with AI ..." />
          <Button>Send message</Button>
        </div>
      </div>
    </div>
  );
}

