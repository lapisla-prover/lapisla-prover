"use client";
import { Editor, useMonaco } from "@monaco-editor/react";
import { FC, use, useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { getSnapshotInfoFromId } from "@/utils/parseSnapshot";
import { useSearchParams } from "next/navigation";
import { configureMonaco } from "@/lib/monacoConfig";

interface ViewProps {
  params: Promise<{
    id: string;
  }>;
}
type SnapshotInfo = {
  owner: string;
  fileName: string;
  version: number;
};

const View: FC<ViewProps> = ({ params }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // クエリパラメータ `id` を取得
  const [snapshotInfo, setSnapshotInfo] = useState<SnapshotInfo>({
    owner: "",
    fileName: "",
    version: 0,
  });
  const [isEditorMounted, setEditorMounted] = useState(false);

  const viewEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  const monacoInstance = useMonaco();
  useEffect(() => {
    if (monacoInstance) {
      configureMonaco(monacoInstance);
    }
  }, [monacoInstance]);

  useEffect(() => {
    if (!id) return;
    const result = getSnapshotInfoFromId(id);
    if (result.isOk()) {
      const { owner, fileName, version } = result.value;
      setSnapshotInfo({ owner, fileName, version });
    }
  }, [id]);

  useEffect(() => {
    const fetchSnapshot = async () => {
      if (
        !snapshotInfo.owner ||
        !snapshotInfo.fileName ||
        !snapshotInfo.version
      )
        return;
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/files/${snapshotInfo.owner}/${snapshotInfo.fileName}/${snapshotInfo.version}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        viewEditorRef.current?.setValue(data.content);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSnapshot();
  }, [snapshotInfo, isEditorMounted]);

  return (
    <div className="p-8 gap-8">
      <div className="w-[60%] p-4 space-y-4">
        <div className="flex justify-between items-end">
          <div className="text-2xl font-bold">
            {snapshotInfo.owner}/{snapshotInfo.fileName}
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
          viewEditorRef.current = editor;
          setEditorMounted(true);
        }}
      />
    </div>
  );
};

export default View;
