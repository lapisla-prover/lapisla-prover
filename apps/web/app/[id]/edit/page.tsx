"use client";

import { SideMenu } from "@/components/sidemenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search
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

      <SideMenu />

      

      <div className="w-[80%] p-4 space-y-4">

        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">abap34/simplest-sort.l</div>
          <div className="text-gray-500">Last saved 2 minutes ago</div>
        </div>

        <div className="flex justify-end items-center">


          <div className="flex gap-2">

            {/* Up Button */}
            <Button variant="ghost" size="sm" className="p-1" title="Move Up">
              <ChevronUp className="h-4 w-4" />
            </Button>

            {/*  Down Button */}
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

            {/* Up all button */}
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


            {/* Down all button */}
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

        {/* Main Editor */}
        {/* Goal Visualizer */}
        <Editor
          className="h-full w-full"
          height="100%"
          theme="vs"
          language="lapisla"

          options={{
            minimap: { enabled: true },
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
          {/* Goal Visualizer */}
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
            defaultValue={`Waiting start of proof...`}
            onMount={(editor, monaco) => {
              goalEditorRef.current = editor;
            }
            }
          />
        </div>





      </div>
    </div>
  );
}

