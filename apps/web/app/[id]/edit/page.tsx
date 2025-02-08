"use client";

import { SideMenu } from "@/components/sidemenu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAccount } from "@/context/accountContext";
import {
  executeAll,
  step,
  undo,
  undoLocation,
  undoUntil,
} from "@/lib/editorEventHandler";
import { EditorInteracter } from "@/lib/editorInteracter";
import { configureMonaco } from "@/lib/monacoConfig";
import { useKernel } from "@/lib/userKernel";
import { ensureFileExtension } from "@/utils/ensureFileExtension";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import Editor, { useMonaco } from "@monaco-editor/react";
import { formatFormula } from "@repo/kernel/ast";
import { Env, initialEnv } from "@repo/kernel/env";
import { isBefore } from "@repo/kernel/parser";
import {
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Goal,
  MessageSquare,
  Mic,
  Mountain,
  Search,
} from "lucide-react";
import * as monaco from "monaco-editor";
import { FC, use, useEffect, useRef, useState } from "react";
export const runtime = "edge";

interface EditProps {
  params: Promise<{
    id: string;
  }>;
}

const Edit: FC<EditProps> = ({ params }) => {
  const monacoInstance = useMonaco();
  const { id } = use(params);
  const { account } = useAccount();
  const [versions, setVersions] = useState<number[]>([]);
  const [currentSnapshotId, setCurrentSnapshotId] = useState<string>("");
  const [recentSavedTime, setRecentSavedTime] = useState<string>("");
  const [isEditorMounted, setEditorMounted] = useState(false);

  useEffect(() => {
    if (monacoInstance) {
      configureMonaco(monacoInstance);
    }
  }, [monacoInstance]);

  const kernel = useKernel();
  const mainEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const goalEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const messageEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null,
  );
  const [latestProgram, setLatestProgram] = useState<string>("");
  const [interacter, setInteracter] = useState<EditorInteracter | null>(null);
  const [globalenv, setGlobalEnv] = useState<Env>(initialEnv());

  useEffect(() => {
    if (
      mainEditorRef.current &&
      goalEditorRef.current &&
      messageEditorRef.current
    ) {
      setInteracter(
        new EditorInteracter(monacoInstance, mainEditorRef, goalEditorRef, messageEditorRef),
      );
    }
  }, [mainEditorRef.current, goalEditorRef.current, messageEditorRef.current]);

  const resetAll = () => {
    kernel.reset();
    interacter.resetGoalEditorContent();
    interacter.resetGreenHighlight();
  };

  const updateEnv = () => {
    setGlobalEnv(kernel.currentglobalEnv());
  };

  useEffect(() => {
    if (kernel && interacter) {
      mainEditorRef.current.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.DownArrow,
        async () => {
          await step(kernel, interacter);
          updateEnv();
        },
      );

      mainEditorRef.current.addCommand(
        monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.UpArrow,
        () => {
          undo(kernel, interacter, 1);
          updateEnv();
        },
      );
    }
  }, [kernel, interacter]);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/me/files/${id}`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        setVersions([...data.versions]);
        setRecentSavedTime(data.updatedAt);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFile();
  }, []);

  useEffect(() => {
    if (versions.length > 0) {
      const fetchLatestProgram = async () => {
        try {
          const response2 = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/me/files/${id}/${Math.max(...versions).toString()}`,
            {
              credentials: "include",
            },
          );
          const data2 = await response2.json();
          mainEditorRef.current?.setValue(data2.content);
          setCurrentSnapshotId(data2.meta.id);
        } catch (error) {
          console.error(error);
        }
      };
      fetchLatestProgram();
    }
  }, [versions, id, isEditorMounted]);

  return (
    <div className="flex">
      <SideMenu
        fileName={id}
        content={latestProgram}
        version={Math.max(...versions)}
        setRecentSavedTime={setRecentSavedTime}
        enabledFeatures={new Set(["home", "files", "timeline", "document", "save", "share", "register"])}
      />

      <div className="w-[80%] p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-3xl text-gray-700 font-bold g-4 p-4 font-monaco">
            {account.username}/{ensureFileExtension(id)}
          </div>
          <div className="text-gray-500">
            Last saved {formatRelativeTime(recentSavedTime)}
          </div>
        </div>

        <div className="border-b border-gray-300"></div>

        <div className="flex justify-end items-center">
          <div className="flex">
            {/* Up Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              title="Move Up"
              onClick={() => {
                undo(kernel, interacter, 1);
                updateEnv();
              }}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>

            {/*  Down Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              title="Move Down"
              onClick={() => {
                step(kernel, interacter);
                updateEnv();
              }}
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
                resetAll();
                updateEnv();
              }}
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
                resetAll();
                executeAll(kernel, interacter);
                updateEnv();
              }}
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
          defaultValue={`# Welcome to Lapisla! Write your proof here.`}
          onChange={(value: string | undefined, event) => {
            if (interacter) {
              // reset Error
              const model = mainEditorRef.current.getModel();
              if (model) {
                monacoInstance.editor.setModelMarkers(model, "error", []);
                interacter.setMessagesEditorContent("");
              }
            }

            if (value) {
              // Undo check
              const changeloc = undoLocation(latestProgram, value);
              if (changeloc) {
                if (isBefore(changeloc, kernel.lastLocation())) {
                  undoUntil(kernel, interacter, changeloc);
                }
              }

              // Parse for Error check
              const result = kernel.parse(value);

              if (result.tag === "Err") {
                const errorloc = result.error.error.loc;
                if (interacter) {
                  const msg =
                    "Syntax Error:\n" +
                    result.error.error.message +
                    "\n at row " +
                    (errorloc.start.line + 1) +
                    ".";

                  interacter.setMessagesEditorContent(msg);

                  const model = mainEditorRef.current.getModel();

                  if (model) {
                    monacoInstance.editor.setModelMarkers(model, "error", [
                      {
                        startLineNumber: errorloc.start.line + 1,
                        startColumn: errorloc.start.column + 1,
                        endLineNumber: errorloc.end.line + 1,
                        endColumn: errorloc.end.column + 1,
                        message: result.error.error.message,
                        severity: monacoInstance.MarkerSeverity.Error,
                      },
                    ]);
                  }
                }
              }

              setLatestProgram(value);
            }
          }}
          onMount={(editor, monaco) => {
            mainEditorRef.current = editor;
            setEditorMounted(true);
          }}
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

        <Card className="p-4">
          <div className="flex items-center space-x-2 py-2">
            <Goal className="h-6 w-6 text-primary" />
            <div className="text-2xl font-bold">Goal</div>
          </div>

          <div className="w-full h-48">
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
              defaultValue={``}
              onMount={(editor, monaco) => {
                goalEditorRef.current = editor;
              }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2  py-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <div className="text-2xl font-bold">Messages</div>
          </div>

          <div className="w-full h-24 text-red-500">
            {/* Message Visualizer */}
            <Editor
              className="h-full w-full"
              height="100%"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: "off",
              }}
              defaultValue={``}
              onMount={(editor, monaco) => {
                messageEditorRef.current = editor;
              }}
            />
          </div>
        </Card>

        <Card className="p-4">
          {/* Environment Table */}
          <div className="flex items-center space-x-2 py-2">
            <Mountain className="h-6 w-6 text-primary" />
            <div className="text-2xl font-bold">Environment</div>
          </div>

          <div className="max-h-64 overflow-y-scroll scrollbar scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell>Identifier</TableCell>
                  <TableCell>Formula</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(globalenv.thms.entries()).map(([key, value]) => {
                  return (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{formatFormula(value)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

      </div>
      <style>
        {`
          .green-highlight {
            background-color: rgba(144, 238, 144, 0.5);
          }

          .error-highlight {
            background-color: rgba(255, 192, 203, 0.5);
            border-bottom: 1px solid red;
          } 
        `}
      </style>
    </div>
  );
};

export default Edit;
