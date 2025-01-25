import * as monaco from "monaco-editor";

import { Location, Range } from "@repo/kernel/parser";

export function drawHighlight(
    editor: monaco.editor.IStandaloneCodeEditor,
    range: Range,
    className: string,
    hovermessage: string = ""
): monaco.editor.IEditorDecorationsCollection {
    return editor.createDecorationsCollection(
        [
            {
                range: {
                    startLineNumber: range.start.line + 1,
                    startColumn: range.start.column + 1,
                    endLineNumber: range.end.line + 1,
                    endColumn: range.end.column + 1,
                },
                options: {
                    isWholeLine: false,
                    className: className,
                    hoverMessage: {
                        value: hovermessage,
                    },
                },
            },
        ]
    )
  
}