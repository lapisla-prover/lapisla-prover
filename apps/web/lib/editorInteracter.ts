import { Range } from '@repo/kernel/parser';
import * as monaco from 'monaco-editor';
import { drawHighlight } from './drawHighlight';

export class EditorInteracter {
  mainEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  goalEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  highlightHistory: monaco.editor.IEditorDecorationsCollection[];

  constructor(mainEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>, goalEditorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>) {
    this.mainEditorRef = mainEditorRef;
    this.goalEditorRef = goalEditorRef;
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

  resetGoalEditorContent(): void {
    if (this.goalEditorRef.current) {
      this.goalEditorRef.current.setValue("");
    }
  }

  highlight(range: Range) {
    if (this.mainEditorRef.current) {
      this.highlightHistory.push(drawHighlight(this.mainEditorRef.current, range));
    }
  }

  removeHighlight(steps: number) {
    if (this.mainEditorRef.current) {
      for (let i = 0; i < steps; i++) {
        const highlight = this.highlightHistory.pop();
        if (highlight) {
          highlight.clear();
        }
      }
    }
  }

  resetHighlight() {
    if (this.mainEditorRef.current) {
      this.highlightHistory.forEach((highlight) => {
        highlight.clear();
      });
    }

    this.highlightHistory = [];
  }

  getHighlightHistory() {
    return this.highlightHistory;
  }

  errormessage(message: string, range: Range) {
    console.log(message + " at " + range.start.line + ":" + range.start.column);
  }

}




