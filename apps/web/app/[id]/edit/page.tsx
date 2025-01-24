"use client";

import { SideMenu } from "@/components/sidemenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { configureMonaco } from "@/lib/monacoConfig";
import Editor, { useMonaco } from "@monaco-editor/react";

import { drawHighlight } from "@/lib/drawHighlight";
import { step } from "@/lib/editorEventHandler";
import { Kernel } from "@repo/kernel/kernel";
import { Range } from "@repo/kernel/parser";
import {
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Goal,
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

  function highliter(range: Range) {
    if (mainEditorRef.current) {
      drawHighlight(mainEditorRef.current, range);
    }
  }

  if (monaco) {
    configureMonaco(monaco);
  }

  const kernel = new Kernel();

  return (
    <div className="flex">

      <SideMenu />


      <div className="w-[80%] p-4 space-y-4">

        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold g-4 p-4">abap34/simplest-sort.l</div>
          <div className="text-gray-500">Last saved 2 minutes ago</div>
        </div>

        {/* 灰色の線 */}
        <div className="border-b border-gray-300"></div>

        <div className="flex justify-end items-center">


          <div className="flex">

            {/* Up Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              title="Move Up"
              onClick={
                () => {
                  setGoalEditorContent("↑")
                }
              }>

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
                    setGoalEditorContent,
                    highliter
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
        <Editor
          className="h-full w-full"
          height={"calc(100vh - 200px)"}
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

      <div className="w-[40%] p-8 space-y-4">
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

        <div className="flex items-center space-x-2">
          <Goal className="h-6 w-6 text-primary" />
          <div className="text-2xl font-bold">Goal</div>
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
      <style>
        {`
          .green-highlight {
            background-color: rgba(144, 238, 144, 0.5);
          }
        `}
      </style>

    </div>


  );
}

