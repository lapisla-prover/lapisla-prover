import * as monaco from "monaco-editor";

import { Location, Range } from "@repo/kernel/parser";

export function drawHighlight(
    editor: monaco.editor.IStandaloneCodeEditor,
    range: Range
) {
    editor.createDecorationsCollection(
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
                    className: "green-highlight",
                    hoverMessage: {
                        value: "This is a highlight",
                    },
                },
            },
        ]
    )
  
}