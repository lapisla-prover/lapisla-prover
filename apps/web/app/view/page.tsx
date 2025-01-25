"use client";
import { Editor } from "@monaco-editor/react";
import { FC, use, useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";

interface ViewProps {
  params: Promise<{
    id: string;
  }>;
}

const View: FC<ViewProps> = ({ params }) => {
  const { id } = use(params);
  const [fileName, setFileName] = useState<string>("");
  const [userName, setUseName] = useState<string>("");

  const mainEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  useEffect(() => {
    console.log(id);
    // mainEditorRef.current?.setValue(data.content);
  }, [id]);
  return (
    <div className="p-8 gap-8">
      <div className="w-[60%] p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">
            {userName}/{fileName}
          </div>
        </div>
        <div className="h-0.5 w-full bg-black" />
      </div>
      <Editor
        className="h-full w-full mt-4 border border-black"
        height={"calc(100vh - 200px)"}
        theme="vs"
        language="lapisla"
        options={{
          readOnly: true,
        }}
        onMount={(editor, monaco) => {
          mainEditorRef.current = editor;
        }}
      />
    </div>
  );
};

export default View;
