"use client";
import { Editor } from "@monaco-editor/react";

export default function View() {
  // { fileName, content} = useHoge();
  return (
    <div className="p-8 gap-8">
      <div className="w-[60%] p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">abap34/simplest-sort.l</div>
        </div>
        <div className="h-0.5 w-full bg-black" />
      </div>
      <Editor
        className="h-full w-full mt-4 border border-black"
        height={"calc(100vh - 200px)"}
        theme="vs"
        options={{
          readOnly: true,
        }}
      />
    </div>
  );
}
