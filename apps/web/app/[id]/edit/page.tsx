"use client";



import { Register } from "@/components/register";
import { Share } from "@/components/share";
import { SideMenu } from "@/components/sidemenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { configureMonaco } from "@/lib/monacoConfig";
import Editor, { useMonaco } from "@monaco-editor/react";

import { step } from "@/lib/editorEventHandler";
import { Kernel } from "@repo/kernel/kernel";
import {
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Mic,
  Save,
  Search,
} from "lucide-react";
import * as monaco from 'monaco-editor';
import { useRef } from "react";

export const runtime = "edge";

export default function Edit() {
  const monaco = useMonaco();
  const mainEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const goalEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  function getMainEditorContent(): string {
    if (mainEditorRef.current) {
      return mainEditorRef.current.getValue();
    }
    return "";
  }

  function setGoalEditorContent(content: string): void {
    if (goalEditorRef.current) {
      goalEditorRef.current.setValue(content);
    }
  }

  if (monaco) {
    configureMonaco(monaco);
  }

  const kernel = new Kernel();

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
          <div className="flex justify-end items-center">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="p-1" title="Move Up">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                title="Move Down"
                onClick={
                  () => {
                    step(
                      kernel,
                      getMainEditorContent,
                      setGoalEditorContent
                    );
                  }
                }
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                title="Move to Top"
                onClick={() => {
                  if (goalEditorRef.current) {
                    goalEditorRef.current.setValue("↑↑");
                  }
                }
                }
              >
                <ChevronsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                title="Move to Bottom"
                onClick={() => {
                  if (goalEditorRef.current) {
                    goalEditorRef.current.setValue("↓↓");
                  }
                }
                }
              >
                <ChevronsDown className="h-4 w-4" />
              </Button>
            </div>
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
            language="proof-state"

    
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineNumbers: "off",
            }}
            defaultValue={`# Write your proof here!
Theorem thm1 P → P
 apply ImpR
  apply I
qed
`}
            onMount={(editor, monaco) => {
              mainEditorRef.current = editor;
            }
            }
          />
        </div>

        <div>
          <div className="text-2xl font-bold">Suggestion:</div>
          <div className="text-gray-700">Proof Found!</div>
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
              value="Waiting for proof ..."
              onMount={(editor, monaco) => {
                goalEditorRef.current = editor;
              }
              }
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

