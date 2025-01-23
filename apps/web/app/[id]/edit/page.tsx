"use client"

import { SideMenu } from "@/components/sidemenu"
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
    <div className="flex h-screen">
      <SideMenu />
      <div className="flex-1 flex ml-16">
        <div className="w-[60%] p-4 space-y-4">
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold ml-4">abap34/simplest-sort.lapis</div>
            <div className="text-gray-500">Last saved 2 minutes ago</div>
          </div>

          <div className="h-0.5 w-full bg-gray-200" />

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


          <div className="flex justify-end items-center">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="p-1" title="Move Up">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1" title="Move Down">
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1" title="Move to Top">
                <ChevronsUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1" title="Move to Bottom">
                <ChevronsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Editor
            className="h-full w-full mt-4"
            height="calc(100vh - 200px)"
            theme="vs-light"
            language="lapisla"
            options={{
              unicodeHighlight: {
                ambiguousCharacters: false,
              },
              minimap: { enabled: false },
            }}
            defaultValue="# Write your proof here!"
          />
        </div>

        <div className="w-[40%] p-4 space-y-4 overflow-y-auto border-gray-200">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Registry"
              className="pl-9 pr-9 rounded-full border border-gray-200 bg-background"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Voice search"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <div className="w-full h-64 border border-gray-200">
            <Editor
              className="h-full w-full"
              height="100%"
              theme="vs-light"
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

          <div className="w-full h-32 border border-gray-200">
            <Editor
              className="h-full w-full"
              height="100%"
              theme="vs-light"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: "off",
              }}
              value="Proof: 1 + 1 = 2"
            />
          </div>

          <div className="grid w-full gap-2">
            <Textarea placeholder="Chat with AI ..." className="border-gray-200" />
            <Button>Send message</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

