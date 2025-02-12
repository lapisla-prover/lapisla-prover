import { Range } from "@repo/kernel/parser";
import * as monaco from "monaco-editor";
import { drawHighlight } from "./drawHighlight";

export class EditorInteracter {
  monacoInstance: typeof monaco;
  mainEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  goalEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  messageEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  highlightHistory: monaco.editor.IEditorDecorationsCollection[];

  constructor(
    monacoInstance: typeof monaco,
    mainEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>,
    goalEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>,
    messageEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>,
  ) {
    this.monacoInstance = monacoInstance;
    this.mainEditorRef = mainEditorRef;
    this.goalEditorRef = goalEditorRef;
    this.messageEditorRef = messageEditorRef;
    this.highlightHistory = [];
  }

  getMainEditorContent(): string {
    if (this.mainEditorRef.current) {
      return this.mainEditorRef.current.getValue();
    }
    return "";
  }

  setGoalEditorContent(content: string): void {
    if (this.goalEditorRef.current) {
      this.goalEditorRef.current.setValue(content);
    }
  }

  setMessagesEditorContent(content: string): void {
    if (this.messageEditorRef.current) {
      this.messageEditorRef.current.setValue(content);
    }
  }

  resetGoalEditorContent(): void {
    if (this.goalEditorRef.current) {
      this.goalEditorRef.current.setValue("");
    }
  }

  greenHighlight(range: Range) {
    if (this.mainEditorRef.current) {
      this.highlightHistory.push(
        drawHighlight(
          this.monacoInstance,
          this.mainEditorRef.current,
          range,
          "green-highlight",
        ),
      );
    }
  }

  removeGreenHighlight(steps: number) {
    if (this.mainEditorRef.current) {
      for (let i = 0; i < steps; i++) {
        const highlight = this.highlightHistory.pop();
        if (highlight) {
          highlight.clear();
        }
      }
    }
  }

  resetGreenHighlight() {
    if (this.mainEditorRef.current) {
      this.highlightHistory.forEach((highlight) => {
        highlight.clear();
      });
    }

    this.highlightHistory = [];
  }
}
