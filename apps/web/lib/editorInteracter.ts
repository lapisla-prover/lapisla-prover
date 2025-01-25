import { Range } from '@repo/kernel/parser';
import * as monaco from 'monaco-editor';
import { drawHighlight } from './drawHighlight';

export class EditorInteracter {
  mainEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  goalEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  messageEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  greenHighlightHistory: monaco.editor.IEditorDecorationsCollection[];
  errorHighlightHistory: monaco.editor.IEditorDecorationsCollection[];

  constructor(mainEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>, goalEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>, messageEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>) {
    this.mainEditorRef = mainEditorRef;
    this.goalEditorRef = goalEditorRef;
    this.messageEditorRef = messageEditorRef;
    this.greenHighlightHistory = [];
    this.errorHighlightHistory = [];
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
      this.greenHighlightHistory.push(drawHighlight(this.mainEditorRef.current, range, "green-highlight"));
    }
  }

  removeGreenHighlight(steps: number) {
    if (this.mainEditorRef.current) {
      for (let i = 0; i < steps; i++) {
        const highlight = this.greenHighlightHistory.pop();
        if (highlight) {
          highlight.clear();
        }
      }
    }
  }

  resetGreenHighlight() {
    if (this.mainEditorRef.current) {
      this.greenHighlightHistory.forEach((highlight) => {
        highlight.clear();
      });
    }

    this.greenHighlightHistory = [];
  }

  resetError() {
    if (this.mainEditorRef.current) {
      this.errorHighlightHistory.forEach((highlight) => {
        highlight.clear();
      });
    }

    this.errorHighlightHistory = [];
    this.setMessagesEditorContent("");
  }

  getHighlightHistory() {
    return this.greenHighlightHistory;
  }

  errormessage(message: string, range: Range) {
    if (this.mainEditorRef.current) {
      this.errorHighlightHistory.push(drawHighlight(this.mainEditorRef.current, range, "error-highlight", message));
    }

    this.setMessagesEditorContent(message);
  }

}




