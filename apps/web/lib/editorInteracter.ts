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

}




